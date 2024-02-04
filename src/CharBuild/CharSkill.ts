import { JArray, JObject, JToken, UtilFunc } from "@zwa73/utils";
import { CMDef } from "CMDefine";
import { Spell, SpellEnergySource, SpellID ,AnyItemID, FlagID, BoolObj, Eoc, EocEffect, EocID, NumMathExp, NumObj, NoParamTalkerCondList, WeaponCategoryID, EffectID, Time, ParamsEoc, InlineEoc, SpellFlag, DamageTypeID, Resp, CondObj, SoundEffectID, SoundEffectVariantID} from "cdda-schema";
import { CDataManager } from "../DataManager";
import { CON_SPELL_FLAG, SPELL_CT_MODMOVE, SPELL_CT_MODMOVE_VAR, SPELL_M1T, SPELL_MAX_DAMAGE,TARGET_MON_ID } from "StaticData";
import { CCharHookList, CCharHook, CInteractHookList } from "CnpcEvent";
import { SpecEffect, SpecProcMap, SpecSkillCastData } from "./CharSkillSpecEffect";


/**角色技能 */
export type CharSkill = {
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
    extra_effect?  :Spell[];
    /**特殊的子效果 */
    spec_effect?   :SpecEffect[];
    /**技能音效 */
    audio?          :(string|{
        /**音效变体ID */
        id:string,
        /**产生音效的概率 1/n 默认1 */
        one_in_chance?:number,
        /**音量 1-128 默认100 */
        volume?:number,
        /**声音冷却  
         * 每隔n次战斗刷新可触发
         */
        cooldown?:number;
    })[];
    /**要求强化字段 [字段,强化等级] 或 字段名 */
    require_field?:[string,number]|string;
    /**释放成功后运行的效果 */
    after_effect?:EocEffect[];
    /**尝试释放时就运行的效果 */
    before_effect?:EocEffect[];
    /**需求的武器flag  
     * 在角色配置中定义的 武器 会自动生成并添加同ID Flag  
     */
    require_weapon_flag?:FlagID[];
    /**需求的武器分类 */
    require_weapon_category?:WeaponCategoryID[];
    /**需求无武器/完全徒手 */
    require_unarmed?:boolean;
};

//全局冷却字段名
const gcdValName = `u_coCooldown`;

/**使某个技能停止使用的全局变量 */
export function getGlobalDisableSpellVar(charName:string,spell:Spell){
    return `${charName}_${spell.id}_disable`;
}
/**使某个技能停止使用的变量 */
export function getDisableSpellVar(talker:"u"|"n",spell:Spell){
    return `${talker}_${spell.id}_disable`;
}
/**解析音频id */
function parseAudioString(charName:string,str:string,volume:number=100){
    let soundName = charName;
    let varName = str;
    if(str.includes(":")){
        const match = str.match(/(.+):(.+)/);
        if(match==null) throw `parseAudioString 解析错误 字符串:${str}`;
        soundName = match[1];
        varName = match[2];
    }
    return {
        sound_effect:varName    as SoundEffectVariantID ,
        id          :soundName  as SoundEffectID        ,
        volume
    };
}


/**处理角色技能 */
export async function createCharSkill(dm:CDataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);
    const skills = (charConfig.skill??[]);
    const skillDataList:JObject[] = [];


    //遍历技能
    for(const skill of skills){
        const {spell,extra_effect,audio,require_field,after_effect,before_effect,require_weapon_flag,require_weapon_category,require_unarmed,spec_effect} = skill;

        //修正子法术
        const extraEffects = extra_effect??[];

        //生成冷却变量名
        const cdValName = `u_${spell.id}_cooldown`;

        //计算成功效果
        const TEffect:EocEffect[]=[];
        if(audio){
            TEffect.push(...audio.map(audioObj=>{
                if(typeof audioObj == "string")
                    return parseAudioString(charName,audioObj);
                //冷却变量ID
                const cdid = `audio_${audioObj.id}_cooldown`;
                if(audioObj.cooldown){
                    //冷却
                    const cdeoc=CMDef.genActEoc(cdid,[{math:[cdid,"-=","1"]}],{math:[cdid,">","0"]});
                    dm.addCharEvent(charName,"BattleUpdate",0,cdeoc);
                    skillDataList.push(cdeoc);
                    //初始化
                    const initeoc=CMDef.genActEoc(cdid+"_init",[{math:[cdid,"=","0"]}]);
                    dm.addCharEvent(charName,"EnterBattle",0,initeoc);
                    skillDataList.push(initeoc);
                }
                const effect:EocEffect = {
                    run_eocs:{
                        id:CMDef.genEOCID(`${charName}_${audioObj.id}_Chance`),
                        eoc_type:"ACTIVATION",
                        condition:{and:[
                            {one_in_chance:audioObj.one_in_chance??1},
                            {math:[cdid,"<=","0"]}
                        ]},
                        effect:[
                            parseAudioString(charName,audioObj.id,audioObj.volume),
                            {math:[cdid,"=",(audioObj.cooldown??0)+""]}
                        ],
                    }
                };
                return effect;
            }));
        }
        if(after_effect)
            TEffect.push(...after_effect);
        //施法后暂停施法时间
        if(spell.base_casting_time){
            const ct = parseSpellNumObj(spell,"base_casting_time");
            TEffect.push(
                {math:[SPELL_CT_MODMOVE_VAR,"=",ct]},
                {u_cast_spell:{id:SPELL_CT_MODMOVE,hit_self:true}}
            );
        }

        //计算准备效果
        const PreEffect:EocEffect[] = [];
        if(before_effect)
            PreEffect.push(...before_effect)


        //生成子效果 并加入子法术 extraEffects
        const specDat:SpecSkillCastData = {
            skill, TEffect, PreEffect, extraEffects,
        }
        let specindex = 0;
        for(const spec of spec_effect??[])
            SpecProcMap[spec.type](dm,charName,specDat,spec,specindex++);
        //加入子效果
        if(extraEffects.length>0){
            spell.extra_effects=spell.extra_effects??[];
            spell.extra_effects.push(...extraEffects.map(spell=>({id:spell.id})))
        }

        //计算基础条件 确保第一个为技能开关, 用于cast_control读取
        const baseCond: (BoolObj)[] = [
            {math:[getDisableSpellVar("u",spell),"!=","1"]},
            {math:[gcdValName,"<=","0"]},
        ];
        if(require_field){
            let fdarr = typeof require_field == "string"
                ? [require_field,1] as const : require_field;
            baseCond.push({math:[`u_${fdarr[0]}`,">=",fdarr[1]+""]});
        }
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
            baseCond.push({or:requireWeaponCond})

        //处理并加入输出
        const dat:BaseSkillCastData = {
            skill, TEffect, PreEffect,
            baseCond, extraEffects,
        }
        //生成法术
        skillDataList.push(...(await ProcMap[target??"auto"](dm,charName,dat)));

        dm.addSharedRes(spell.id,spell,"common_resource","common_spell");
        for(const exspell of extraEffects)
            dm.addSharedRes(exspell.id,exspell,"common_resource","common_spell");
    }

    outData['skill'] = skillDataList;
}

/**基础技能数据 */
type BaseSkillCastData=Readonly<{
    /**技能 */
    skill:CharSkill;
    /**基础释放eoc条件 */
    baseCond: (BoolObj)[];
    /**基础成功eoc效果 */
    TEffect:EocEffect[];
    /**基础准备释放Eoc */
    PreEffect:EocEffect[];
    /**子法术 */
    extraEffects:Spell[];
}>

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