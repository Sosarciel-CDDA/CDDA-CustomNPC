import { JArray, JObject, JToken, UtilFunc } from "@zwa73/utils";
import { CON_SPELL_FLAG, genEOCID, genSpellID } from ".";
import { BoolObj, Eoc, EocEffect, NumMathExp, NumObj } from "./CddaJsonFormat/Eoc";
import { Spell, SpellEnergySource, SpellID } from "./CddaJsonFormat/Spell";
import { DataManager } from "./DataManager";
import { TARGET_MON_ID } from "./StaticData/BaseMonster";
import { CharEventTypeList, CharEventType, InteractiveCharEventList, ReverseCharEventTypeList, ReverseCharEventType, AnyCharEvenetType } from "./Event";
import { getFieldVarID } from "./CharConfig";


/**技能选择目标类型 列表 */
const TargetTypeList = [
    "auto"          ,//自动         任意非翻转hook
    "random"        ,//原版随机     任意非翻转hook
    "spell_target"  ,//瞄准法术标靶 任意非翻转hook 但法术标靶只在造成伤害时生成
    "reverse_hit"   ,//翻转命中交互单位 u为角色 n为受害者 处理时翻转 hook必须为ReverseCharEventType
    "direct_hit"    ,//直接命中交互单位 u为角色 n为受害者 hook必须为InteractiveCharEvent
    "auto_hit"      ,//自动判断命中交互单位 hook必须为InteractiveCharEvent或ReverseCharEventType
    "filter_random" ,//筛选目标随机 u为角色 n为受害者 处理时翻转 任意非翻转hook
]as const;
/**技能选择目标类型 */
type TargetType = typeof TargetTypeList[number];
/**角色技能 */
export type CharSkill = {
    /**技能的释放条件 */
    cast_condition:CastCondition|CastCondition[];
    /**权重 优先尝试触发高权重的spell 默认0 */
    weight?         :number,
    /**概率 有1/chance的几率使用这个技能 默认1 */
    one_in_chance?  :number,
    /**冷却时间 单位为每次CharUpdate 默认0 */
    cooldown?       :number,
    /**共同冷却时间 影响所有技能的释放 单位为每次CharUpdate 默认1  
     * 一个高权重0共同冷却的技能意味着可以同时触发  
     */
    common_cooldown?:number,
    /**法术效果  
     * 可用 {{字段}} 或 `${角色名}_${字段}` 表示 当前/某个角色 的字段变量  
     * 如 min_damage: {math:["{{重击}} * 10 + Asuna_重击"]}  
     * 可用 `u_${法术id}_cooldown` 获得对应技能冷却  
     * 如 {math:["u_fireball_cooldown"]} 
     * 可用 u_coCooldown 获得公共冷却时间
     */
    spell           :Spell,
    /**技能音效 */
    audio?          :(string|{
        /**音效变体ID */
        id:string,
        /**产生音效的概率 1/n 默认1 */
        one_in_chance?:number,
        /**音量 1-128 默认100 */
        volume?:number,
    })[],
    /**要求强化字段 [字段,强化等级] 或 字段名 */
    require_field?:[string,number]|string;
    /**释放成功后运行的效果 */
    effect?:EocEffect[];
};

/**技能的释放条件 */
export type CastCondition={
    /**释放条件 若允许多个条件请使用{or:[]}  
     * 相同的hook与target将覆盖  
     */
    condition?      :BoolObj,
    /**时机 */
    hook            :AnyCharEvenetType,
    /**瞄准方式  
     * auto 为 根据施法目标自动选择;  
     *  
     * random 为 原版随机 适用于自身buff;  
     *  
     * spell_target 为 瞄准目标周围的 攻击时出现的法术标靶 仅适用于攻击触发的范围技能;  
     *  
     * direct_hit 为 直接命中交互单位 使目标使用此法术攻击自己 适用于单体目标技能  
     * hook 必须为互动事件 "CharTakeDamage" | "CharTakeRangeDamage" | "CharTakeMeleeDamage" | "CharCauseMeleeHit" | "CharCauseRangeHit" | "CharCauseHit";  
     *  
     * reverse_hit 为 翻转命中交互单位 使目标使用此法术攻击自己 适用于单体目标技能  
     * hook 必须为翻转事件 CharCauseDamage | CharCauseMeleeDamage | CharCauseRangeDamage  
     * 除 reverse_hit 外无法使用翻转事件;  
     *  
     * auto_hit 为根据hook在 reverse_hit direct_hit 之间自动判断;  
     *   
     * filter_random 为根据条件筛选可能的目标 命中第一个通过筛选的目标 适用于队友buff;  
     *  
     * 默认为auto  
     * 若允许多个CastCondition 请指定具体type  
     * 相同的hook与target(包括auto或未指定)将覆盖  
     */
    target?         :TargetType;
}

//全局冷却字段名
const gcdValName = `u_coCooldown`;

/**使某个技能停止使用的变量 */
export function stopSpellVar(charName:string,spell:Spell){
    return `${charName}_${spell.id}_stop`;
}

//法术消耗变量类型映射
const costMap:Record<SpellEnergySource,string|undefined>={
    "BIONIC" : "u_val('power')",
    "HP"     : "u_hp()",
    "MANA"   : "u_val('mana')",
    "STAMINA": "u_val('stamina')",
    "NONE"   : undefined,
}

/**处理角色技能 */
export async function createCharSkill(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);
    const skills = (charConfig.skill??[]).sort((a,b)=>(b.weight??0)-(a.weight??0));
    const skillDataList:JObject[] = [];

    //全局冷却事件
    const GCDEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_CoCooldown`),
        effect:[
            {math:[gcdValName,"-=","1"]}
        ],
        condition:{math:[gcdValName,">","0"]},
        eoc_type:"ACTIVATION",
    }
    dm.addCharEvent(charName,"CharUpdate",0,GCDEoc);
    skillDataList.push(GCDEoc);


    //遍历技能
    for(const skill of skills){
        //替换变量字段
        skill.spell = JSON.parse(JSON.stringify(skill.spell)
            .replace(/(\{\{.*?\}\})/g,(match,p1)=>getFieldVarID(charName,p1)));

        const {cast_condition,spell,cooldown,common_cooldown,audio,require_field,effect} = skill;

        //法术消耗字符串
        const spellCost = `min(${spell.base_energy_cost??0}+${spell.energy_increment??0}*`+
            `u_val('spell_level', 'spell: ${spell.id}'),${spell.final_energy_cost??999999})`;
        //法术消耗变量类型
        const costType = spell.energy_source !== undefined
            ? costMap[spell.energy_source]
            : undefined;


        //生成冷却变量名
        const cdValName = `u_${spell.id}_cooldown`;

        //计算成功效果
        const TEffect:EocEffect[]=[];
        if(common_cooldown!=0)
            TEffect.push({math:[gcdValName,"=",`${common_cooldown??1}`]});
        if(spell.base_energy_cost!=undefined && costType!=undefined)
            TEffect.push({math:[costType,"-=",spellCost]});
        if(cooldown)
            TEffect.push({math:[cdValName,"=",`${cooldown??0}`]});
        if(audio){
            TEffect.push(...audio.map(audioObj=>{
                if(typeof audioObj == "string")
                    return ({sound_effect:audioObj,id:charName,volume:100});

                const effect:EocEffect = {
                    run_eocs:{
                        id:genEOCID(`${charName}_${audioObj.id}_Chance`),
                        eoc_type:"ACTIVATION",
                        condition:{one_in_chance:audioObj.one_in_chance??1},
                        effect:[
                            {sound_effect:audioObj.id,id:charName,volume:audioObj.volume??100}
                        ],
                    }
                };
                return effect;
            }));
        }
        if(effect)
            TEffect.push(...effect);

        //遍历释放条件
        const ccs = Array.isArray(cast_condition)
            ?cast_condition
            :[cast_condition] as const;

        for(const castCondition of ccs){
            const {target} = castCondition;
            //计算基础条件
            const baseCond:BoolObj[] = [
                {math:[gcdValName,"<=","0"]},
                {math:[stopSpellVar(charName,spell),"!=","1"]}
            ];
            if(spell.base_energy_cost!=undefined && costType!=undefined)
                baseCond.push({math:[costType,">=",spellCost]});
            if(cooldown)
                baseCond.push({math:[cdValName,"<=","0"]});
            if(require_field){
                let fdarr = typeof require_field == "string"
                    ? [require_field,1] as const : require_field;
                baseCond.push({math:[getFieldVarID(charName,fdarr[0]),">=",fdarr[1]+""]});
            }
            //基本通用数据
            const baseSkillData = {
                skill,
                TEffect,
                baseCond,
                spellCost,
                castCondition,
            }

            //处理并加入输出
            skillDataList.push(...ProcMap[target??"auto"](dm,charName,baseSkillData));
        }
        dm.addSharedRes(spell.id,spell);
        //冷却事件
        if(cooldown!=null){
            const CDEoc:Eoc={
                type:"effect_on_condition",
                id:genEOCID(`${charName}_${spell.id}_cooldown`),
                effect:[
                    {math:[cdValName,"-=","1"]}
                ],
                condition:{math:[cdValName,">","0"]},
                eoc_type:"ACTIVATION",
            }
            dm.addCharEvent(charName,"CharUpdate",0,CDEoc);
            skillDataList.push(CDEoc);
        }
    }

    outData['skill'] = skillDataList;
}

/**处理方式表 */
const ProcMap:Record<TargetType,(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData)=>JObject[]>={
    "auto"          : autoProc,
    "random"        : randomProc,
    "spell_target"  : spell_targetProc,
    "reverse_hit"   : reverse_hitProc,
    "direct_hit"    : direct_hitProc,
    "auto_hit"      : auto_hitProc,
    "filter_random" : filter_randomProc,
}

/**基础技能数据 */
type BaseSkillCastData=Readonly<{
    /**技能 */
    skill:CharSkill;
    /**基础释放eoc条件 */
    baseCond:BoolObj[];
    /**基础成功eoc效果 */
    TEffect:EocEffect[];
    /**释放条件 */
    castCondition: CastCondition;
}>

//获取施法方式的uid
function castCondUid(cc:CastCondition){
    return `${cc.hook}_${cc.target??"auto"}`;
}
//翻转u与n
function revTalker(obj:JToken):any{
    let str = JSON.stringify(obj);
    str = str.replace(/"u_(\w+?)":/g, '"tmpnpctmp_$1":');
    str = str.replace(/(?<!\w)u_/g, 'tmpntmp_');

    str = str.replace(/"npc_(\w+?)":/g, '"u_$1":');
    str = str.replace(/(?<!\w)n_/g, 'u_');

    str = str.replace(/tmpnpctmp_/g, 'npc_');
    str = str.replace(/tmpntmp_/g, 'n_');
    return JSON.parse(str);
}
/**翻转法术 */
function revSpell(charName:string,spell:Spell,ccuid:string):Spell{
    const rspell = UtilFunc.deepClone(spell);
    rspell.name = `${spell.name}_${charName}_reverse_${ccuid}`;
    rspell.id = `${rspell.id}_${charName}_reverse_${ccuid}` as SpellID;
    if(!rspell.valid_targets.includes("self"))
        rspell.valid_targets.push("self");
    return rspell;
}
/**解析伤害字符串 */
function parseNumObj(spell:Spell,field:keyof Spell){
    let strExp = `0`;
    const value = spell[field];
    if(value!==undefined){
        if(typeof value == "number")
            strExp = value+"";
        else if(typeof value == "object" && "math" in value)
            strExp = value.math[0];
        else throw `伤害解析只支持固定值number 或 math表达式`
    }
    return strExp;
}
/**将翻转法术数据转为全局变量
 * 返回 预先计算全局变量的effect
 */
function fixRevSpellDmg(spell:Spell):EocEffect[]{
    const dmgstr = parseNumObj(spell,"min_damage");
    const dotstr = parseNumObj(spell,"min_dot");
    const durstr = parseNumObj(spell,"min_duration");

    const dmgvar = `${spell.id}_reverse_dmg`;
    if(spell.min_damage){
        spell.min_damage = {math:[dmgvar]};
        spell.max_damage = 999999;
    }
    const dotvar = `${spell.id}_reverse_dot`;
    if(spell.min_dot){
        spell.min_dot = {math:[dotvar]};
        spell.max_dot = 999999;
    }
    const durvar = `${spell.id}_reverse_dur`;
    if(spell.min_duration){
        spell.min_duration = {math:[durvar]};
        spell.max_duration = 999999;
    }

    return [
        {math: [dmgvar , `=` , dmgstr]},
        {math: [dotvar , `=` , dotstr]},
        {math: [durvar , `=` , durstr]},
    ];
}

function spell_targetProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    const {skill,baseCond,TEffect,castCondition} = baseSkillData;
    const {spell,one_in_chance} = skill;
    const {hook} = castCondition;
    if(castCondition.condition) baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);

    //创建瞄准法术标靶的辅助索敌法术
    const {min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        max_level,shape} = spell;
    const selTargetSpell:Spell = {
        id:genSpellID(`${spell.id}_SelTarget`),
        type:"SPELL",
        name:spell.name+"_索敌",
        description:`${spell.name}的辅助索敌法术`,
        effect:"attack",
        flags:["WONDER","RANDOM_TARGET",...CON_SPELL_FLAG],
        min_damage: 1,
        max_damage: 1,
        valid_targets:["hostile"],
        targeted_monster_ids:[TARGET_MON_ID],
        min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        shape,max_level,
        extra_effects:[{id:spell.id}],
    }
    dm.addSharedRes(selTargetSpell.id,selTargetSpell);

    //创建施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_Cast${spell.id}_${ccuid}`),
        eoc_type:"ACTIVATION",
        effect:[
            {
                u_cast_spell:{
                    id:selTargetSpell.id,
                    once_in:one_in_chance,
                },
                targeted: true,
                true_eocs:{
                    id:genEOCID(`${charName}_${spell.id}TrueEoc_${ccuid}`),
                    effect:[...TEffect],
                    eoc_type:"ACTIVATION",
                }
            }
        ],
        condition:{and:[...baseCond]},
    }

    //加入触发
    if(ReverseCharEventTypeList.includes(hook as any))
        throw `翻转事件只能应用于翻转命中`
    dm.addCharEvent(charName,hook as CharEventType,0,castEoc);

    return [castEoc];
}

function randomProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    const {skill,baseCond,TEffect,castCondition} = baseSkillData;
    const {spell,one_in_chance} = skill;
    const {hook} = castCondition;
    if(castCondition.condition) baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);

    //创建施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_Cast${spell.id}_${ccuid}`),
        eoc_type:"ACTIVATION",
        effect:[
            {
                u_cast_spell:{
                    id:spell.id,
                    once_in:one_in_chance,
                },
                targeted: false,
                true_eocs:{
                    id:genEOCID(`${charName}_${spell.id}TrueEoc_${ccuid}`),
                    effect:[...TEffect],
                    eoc_type:"ACTIVATION",
                }
            }
        ],
        condition:{and:[...baseCond]},
    }

    //加入触发
    if(ReverseCharEventTypeList.includes(hook as any))
        throw `翻转事件只能应用于翻转命中`
    dm.addCharEvent(charName,hook as CharEventType,0,castEoc);

    return [castEoc];
}



function reverse_hitProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    let {skill,baseCond,TEffect,castCondition} = baseSkillData;
    const {spell,one_in_chance} = skill;
    const {hook} = castCondition;
    if(castCondition.condition) baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);

    //复制法术
    const rspell = revSpell(charName,spell,ccuid);

    //解析伤害字符串
    const dmgPreEff = fixRevSpellDmg(rspell);

    //翻转u与n
    baseCond = revTalker(baseCond);
    TEffect = revTalker(TEffect);

    //创建翻转的施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`Cast${rspell.id}`),
        eoc_type:"ACTIVATION",
        effect:[
            ...dmgPreEff,//预先计算伤害
            {
                u_cast_spell:{
                    id:rspell.id,
                    once_in:one_in_chance,
                    hit_self:true              //如果是翻转事件则需命中自身
                },
                true_eocs:{
                    id:genEOCID(`${rspell.id}TrueEoc`),
                    effect:[...TEffect],
                    eoc_type:"ACTIVATION",
                }
            }
        ],
        condition:{and:[...baseCond]},
    }

    //加入触发
    if(CharEventTypeList.includes(hook as any))
        throw `翻转命中 所用的事件必须为 翻转事件: ${ReverseCharEventTypeList}`
    dm.addReverseCharEvent(charName,hook as ReverseCharEventType,0,castEoc);

    return [rspell,castEoc];
}

function filter_randomProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    let {skill,baseCond,TEffect,castCondition} = baseSkillData;
    const {spell,one_in_chance} = skill;
    const {hook} = castCondition;
    const ccuid = castCondUid(castCondition);

    //复制法术
    const rspell = revSpell(charName,spell,ccuid);

    //解析伤害字符串
    const dmgPreEff = fixRevSpellDmg(rspell);

    //翻转u与n
    const unrbaseCond = UtilFunc.deepClone(baseCond);
    if(castCondition.condition) baseCond.push(castCondition.condition);
    baseCond = revTalker(baseCond);
    TEffect = revTalker(TEffect);

    //命中id
    const fhitvar = `${rspell.id}_hasTarget`;

    //创建翻转的施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`Cast${rspell.id}`),
        eoc_type:"ACTIVATION",
        effect:[
            ...dmgPreEff,//预先计算伤害
            {
                u_cast_spell:{
                    id:rspell.id,
                    once_in:one_in_chance,
                    hit_self:true              //如果是翻转事件则需命中自身
                },
                true_eocs:{
                    id:genEOCID(`${rspell.id}TrueEoc`),
                    effect:[...TEffect,{math:[fhitvar,"=","1"]}],
                    eoc_type:"ACTIVATION",
                }
            }
        ],
        condition:{and:[
            ...baseCond,
            {math:[fhitvar,"!=","1"]},
        ]},
    }


    //创建筛选目标的辅助索敌法术
    const {min_range,max_range,range_increment,
        max_level,valid_targets,targeted_monster_ids} = spell;
    const filterTargetSpell:Spell = {
        id:genSpellID(`${rspell.id}_FilterTarget`),
        type:"SPELL",
        name:rspell.name+"_筛选索敌",
        description:`${rspell.name}的筛选索敌法术`,
        effect:"effect_on_condition",
        effect_str:castEoc.id,
        flags:[...CON_SPELL_FLAG],
        shape:"blast",
        min_aoe:min_range,
        max_aoe:max_range,
        aoe_increment:range_increment,
        max_level,targeted_monster_ids,
        valid_targets:valid_targets.filter(item=>item!="ground"),
    }

    //创建释放索敌法术的eoc
    const castSelEoc:Eoc = {
        type:"effect_on_condition",
        id:genEOCID(`Cast${filterTargetSpell.id}`),
        eoc_type:"ACTIVATION",
        effect:[
            {
                u_cast_spell:{
                    id:filterTargetSpell.id,
                    once_in:one_in_chance,
                }
            },
            {math:[fhitvar,"=","0"]}
        ],
        condition:{and:[...unrbaseCond]},
    }

    //加入触发
    if(ReverseCharEventTypeList.includes(hook as any))
        throw `翻转事件只能应用于翻转命中`
    dm.addCharEvent(charName,hook as CharEventType,0,castSelEoc);

    return [rspell,castEoc,castSelEoc,filterTargetSpell];
}

function direct_hitProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    const {skill,baseCond,TEffect,castCondition} = baseSkillData;
    const {spell,one_in_chance} = skill;
    const {hook} = castCondition;
    if(castCondition.condition) baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);

    //复制法术
    const rspell = revSpell(charName,spell,ccuid);

    //解析伤害字符串
    const dmgPreEff = fixRevSpellDmg(rspell);


    //创建翻转的施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`Cast${rspell.id}`),
        eoc_type:"ACTIVATION",
        effect:[
            ...dmgPreEff,//预先计算伤害
            {
                npc_cast_spell:{
                    id:rspell.id,
                    once_in:one_in_chance,
                    hit_self:true              //如果是翻转事件则需命中自身
                },
                true_eocs:{
                    id:genEOCID(`${rspell.id}TrueEoc`),
                    effect:[...TEffect],
                    eoc_type:"ACTIVATION",
                }
            }
        ],
        condition:{and:[...baseCond]},
    }

    //加入触发
    if(!InteractiveCharEventList.includes(hook as any))
        throw `直接命中 所用的事件必须为 交互事件: ${InteractiveCharEventList}`
    dm.addCharEvent(charName,hook as CharEventType,0,castEoc);

    return [rspell,castEoc];
}

function autoProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    const {skill,castCondition} = baseSkillData;
    const {spell} = skill;
    const {hook} = castCondition;
    //判断瞄准方式
    //是敌对目标法术
    const isHostileTarget = spell.valid_targets.includes("hostile");
    const isAllyTarget    = spell.valid_targets.includes("ally");
    //是Aoe法术
    const isAoe = (spell.min_aoe!=null && spell.min_aoe!=0) ||
        (spell.aoe_increment!=null && spell.aoe_increment!=0);

    //aoe敌对目标法术将使用法术标靶
    if(isHostileTarget && isAoe)
        return ProcMap.spell_target(dm,charName,baseSkillData);

    //友方条件目标法术适用筛选命中
    if(isAllyTarget && castCondition.condition!=undefined)
        return ProcMap.filter_random(dm,charName,baseSkillData);

    //非aoe 且 hook为互动事件的的敌对目标法术 将直接命中
    if((ReverseCharEventTypeList.includes(hook as any)  ||
        InteractiveCharEventList.includes(hook as any)) &&
        isHostileTarget)
        return ProcMap.auto_hit(dm,charName,baseSkillData);

    //其他法术随机
    return ProcMap.random(dm,charName,baseSkillData);
}

function auto_hitProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    const {skill,castCondition} = baseSkillData;
    const {hook} = castCondition;
    if(ReverseCharEventTypeList.includes(hook as any))
        return ProcMap.reverse_hit(dm,charName,baseSkillData);
    if(InteractiveCharEventList.includes(hook as any))
        return ProcMap.direct_hit(dm,charName,baseSkillData);
    throw `auto_hitProc 的hook 必须为 翻转事件:${ReverseCharEventTypeList}\n或互动事件:&{InteractiveCharEventList}`;
}