import { DataManager } from "@src/DataManager";
import { Armor, BoolObj, DamageInfoOrder, DamageType, Eoc, EocEffect, Mutation, MutationID, Spell, Time, Effect, EffectID } from "cdda-schema";
import { CCharHook, CGlobalHook } from "CnpcEvent";
import { genActEoc, genEOCID, genMutationID } from "ModDefine";




/**修改效果为触发性效果, 并创建触发Eoc  
 * EocID为 `${effect.id}_Trigger`  
 * @param dm 管理器
 * @param effect 效果实例
 * @param hook 触发时机
 * @param mode 衰减类型
 * @param eocEffects 触发衰减前的效果
 * @param duration 触发后重置的持续时间
 * @param condition 触发条件
 * @param cooldown 触发间隔
 */
export function genTriggerEffect(dm:DataManager,effect:Effect,hook:CGlobalHook,mode:"/2"|"-1"|"none",
    eocEffects:EocEffect[],duration: (Time),condition?: (BoolObj),cooldown: (Time)=0){
    if(typeof cooldown == "number") cooldown = `${cooldown} s`;
    effect.int_decay_remove = true;

    const fixMode:EocEffect[] = [];
    if(mode=="-1")
        fixMode.push({u_add_effect:effect.id,intensity:{math:[`u_effect_intensity('${effect.id}')-1`]},duration})
    else if(mode=="/2")
        fixMode.push({u_add_effect:effect.id,intensity:{math:[`u_effect_intensity('${effect.id}')/2`]},duration})

    const timevarId = `${effect.id}_Timer`
    const eocid = `${effect.id}_Trigger`;
    const triggerEoc=genActEoc(eocid,[
        ...eocEffects,
        {u_add_var:timevarId,time:true},
        {run_eocs:{
            id:`${eocid}_sub` as any,
            eoc_type:"ACTIVATION",
            condition:{math:[`u_effect_intensity('${effect.id}')`,"<=","1"]},
            effect:[{u_lose_effect:effect.id}],
            false_effect:fixMode
        }}
    ],{and:[
        {u_has_effect:effect.id},
        {or:[
            {u_compare_time_since_var:timevarId,op:">=",time:cooldown},
            {not:{u_has_var:timevarId,time:true}},
        ]},
        ...condition? [condition]:[]]
    },true);
    dm.addEvent(hook,0,triggerEoc);


    return triggerEoc;
}


/**创建添加效果的Eoc  
 * EocID为 `${effect.id}_AddEffect`  
 * 添加层数为 全局变量 `${effect.id}_count`  
 * @param effectID 效果ID
 * @param duration 持续时间
 * @param eocEffects 额外效果
 */
export function genAddEffEoc(effectID:EffectID,duration: (Time), eocEffects?:EocEffect[]){
    const eocid = `${effectID}_AddEffect`;
    const effecteoc = genActEoc(eocid,[
        {u_add_effect:effectID,intensity:{math:[`${effectID}_count`]},duration},
        ...eocEffects??[]
    ],undefined,true);
    return effecteoc;
}

/**修改护甲 并生成添加护甲的变异 
 * ID为`${armor.id}_MUT`
 */
export function genArmorMut(armor:Armor){
    armor.flags?.push(
        "UNBREAKABLE"           ,//不会损坏
        "INTEGRATED"            ,//自体护甲
        "ZERO_WEIGHT"           ,//无重量体积
        "TARDIS"                ,//不会出售
        "PARTIAL_DEAF"          ,//降低音量到安全水平
        "NO_SALVAGE"            ,//无法拆分
        "ALLOWS_NATURAL_ATTACKS",//不会妨碍特殊攻击
        "PADDED"                ,//有内衬 即使没有任何特定材料是柔软的, 这种盔甲也算舒适。
    )
    armor.weight=0;
    armor.volume=0;
    let fixname = armor.name;
    if(typeof fixname != "string")
        fixname = fixname!.str_sp??fixname!.str_pl??fixname!.str??fixname!.ctxt??fixname;
    const mut:Mutation={
        id:`${armor.id}_MUT` as MutationID,
        type:"mutation",
        name:fixname+" 的附带变异",
        description:fixname+" 的附带变异",
        points:0,
        valid:false,
        purifiable:false,
        player_display:false,
        integrated_armor:[armor.id]
    }
    return mut;
}

/**根据伤害生成一个DamageInfoOrder */
export function genDIO(dt:DamageType):DamageInfoOrder{
    return {
        id: dt.id,
        type:"damage_info_order"
    }
}
