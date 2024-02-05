import { JObject, JToken, UtilFT, UtilFunc } from "@zwa73/utils";
import { Spell, FlagID, WeaponCategoryID, BoolObj } from "cdda-schema";
import { CDataManager } from "@src/DataManager";
import { SpecEffect, SpecProcMap, SpecSkillCastData } from "./CharSkillSpecEffect";
import { getCharConfig } from "./CharData";
import { CastAIData, CastAIDataJson, Inherit } from "cdda-smartnpc";
import { getCharMutId } from "./UtilGener";
import { getCharCastAIPath, getCharCastSpellPath } from "CMDefine";


/**角色技能 */
export type CharSkill = {
    /**施法AI */
    cast_ai         :(Inherit|CastAIData);
    /**法术效果  
     * 可用 `u_${字段}` 或 `${角色名}_${字段}` 表示 当前/某个角色 的字段变量  
     * 如 min_damage: {math:["u_重击 * 10 + Asuna_重击"]}  
     *   
     * 可用 `u_${法术id}_cooldown` 获得对应技能冷却  
     * 如 {math:["u_fireball_cooldown"]}  
     *   
     * 可用 u_coCooldown 获得公共冷却时间  
     */
    spell           :Spell;
    /**子法术  
     * 将会随主spell一起解析  
     * 作为spell的extra_effects加入  
     */
    extra_effects?   :Spell[];
    /**特殊的子效果 */
    spec_effect?    :SpecEffect[];
    /**要求强化字段 [字段,强化等级] 或 字段名 */
    require_field?:[string,number]|string;
    /**需求的武器flag  
     * 在角色配置中定义的 武器 会自动生成并添加同ID Flag  
     */
    require_weapon_flag?:FlagID[];
    /**需求的武器分类 */
    require_weapon_category?:WeaponCategoryID[];
    /**需求无武器/完全徒手 */
    require_unarmed?:boolean;
};


/**处理角色技能 */
export async function createCharSkill(dm:CDataManager,charName:string){
    const charConfig = await getCharConfig(charName);
    const spells:JObject[] = [];
    const skills = (charConfig.skill??[]);
    const skillDataList:JObject[] = [];
    const castAIJson:CastAIDataJson = {
        require_mod:"cnpc",
        common_condition:{u_has_trait:getCharMutId(charName)},
        table:{}
    }

    //遍历技能
    for(const skill of skills){
        const {spell,extra_effects,spec_effect,cast_ai} = skill;

        //共同条件
        castAIJson.table[spell.id] = cast_ai;
        const procCommCond = procCommonCond(skill);
        if(procCommCond.length>0)
            cast_ai.common_condition = cast_ai.common_condition
                ? {and:[cast_ai.common_condition,...procCommCond]}
                : {and:[...procCommCond]}

        //修正子法术
        const fixExtraEffects = extra_effects??[];

        //生成子效果 并加入子法术 extraEffects
        const specDat:SpecSkillCastData = {
            skill, extra_effects:fixExtraEffects,
        }
        let specindex = 0;
        for(const spec of spec_effect??[])
            SpecProcMap[spec.type](dm,charName,specDat,spec,specindex++);
        //加入子效果
        if(fixExtraEffects.length>0){
            spell.extra_effects=spell.extra_effects??[];
            spell.extra_effects.push(...fixExtraEffects.map(spell=>({id:spell.id})))
        }
        //生成法术
        dm.addSharedRes(spell.id,spell,"common_resource","common_spell");
        spells.push(spell);
        for(const exspell of fixExtraEffects)
            dm.addSharedRes(exspell.id,exspell,"common_resource","common_spell");
    }
    dm.addCharData(charName,skillDataList,'skill');
    await UtilFT.writeJSONFile(getCharCastAIPath(charName),castAIJson);
    await UtilFT.writeJSONFile(getCharCastSpellPath(charName),spells);
}

function procCommonCond(skill:CharSkill):BoolObj[]{
    const {require_weapon_flag,require_weapon_category,require_unarmed,require_field} = skill;

    const commonCondList:BoolObj[] = [];
    //对所有武器要求进行 或 处理
    const requireWeaponCond: (BoolObj)[] = [];
    if(require_weapon_flag)
        requireWeaponCond.push(...require_weapon_flag.map(id=>
            ({u_has_wielded_with_flag:id})));
    if(require_weapon_category)
        requireWeaponCond.push(...require_weapon_category.map(id=>
            ({u_has_wielded_with_weapon_category:id})));
    if(require_unarmed)
        requireWeaponCond.push({not:"u_has_weapon"});
    if(requireWeaponCond.length>0)
        commonCondList.push({or:requireWeaponCond})

    if(require_field){
        let fdarr = typeof require_field == "string"
            ? [require_field,1] as const : require_field;
        commonCondList.push({math:[`u_${fdarr[0]}`,">=",fdarr[1]+""]});
    }

    return commonCondList;
}

/**解析NumObj为math表达式 */
export function parseNumObj(value:any){
    let strExp = `0`;
    if(value!==undefined){
        if(typeof value == "number")
            strExp = value+"";
        else if(typeof value == "object" && "math" in value)
            strExp = value.math[0];
        else throw `伤害解析只支持固定值number 或 math表达式`
    }
    return strExp;
}
/**解析法术伤害字符串 */
function parseSpellNumObj(spell:Spell,field:keyof Spell){
    return parseNumObj(spell[field]);
}