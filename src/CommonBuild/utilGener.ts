import { Effect, EffectID } from "@src/CddaJsonFormat/Effect";
import { DataManager } from "@src/DataManager";
import { UtilFunc } from "@zwa73/utils";
import { BoolObj, Eoc, EocEffect, Spell, Time } from "CddaJsonFormat";
import { CommonEventType, GlobalEventType } from "Event";
import { genActEoc, genEOCID } from "ModDefine";


/**创建触发性效果 */
export function genTriggerEffect(dm:DataManager,effect:Effect,hook:CommonEventType,
    eocEffects:EocEffect[],duration:Time,condition?:BoolObj){

    const neffect = UtilFunc.deepClone(effect);
    neffect.int_decay_remove = true;

    const eocid = `${neffect.id}_Trigger`;
    const triggerEoc=genActEoc(eocid,[
        ...eocEffects,
        {u_add_effect:effect.id,intensity:{math:[`u_effect_intensity('${neffect.id}')-1`]},duration},
        {run_eocs:{
            id:`${neffect.id}_Trigger` as any,
            eoc_type:"ACTIVATION",
            condition:{math:[`u_effect_intensity('${neffect.id}')`,"<=","0"]},
            effect:[{u_lose_effect:neffect.id}]
        }}
    ],{and:[{u_has_effect:effect.id},...condition? [condition]:[]]},true);
    dm.addEvent(hook,0,triggerEoc);


    return [triggerEoc,neffect];
}

/**创建添加效果的法术 */
export function genEffectSpell(spell:Omit<Spell,"effect_str"|"effect">,
    effectID:EffectID,intensity:number,duration:Time){
    const eocid = `${spell.id}_AddEffect`;
    const nspell:Spell = UtilFunc.deepClone(spell) as Spell;
    nspell.effect = "effect_on_condition";
    nspell.effect_str = eocid;

    const effecteoc = genActEoc(eocid,[
        {u_add_effect:effectID,intensity,duration}
    ],undefined,true);

    return [nspell,effecteoc];
}