import { Effect, EffectID } from "@src/CddaJsonFormat/Effect";
import { DataManager } from "@src/DataManager";
import { UtilFunc } from "@zwa73/utils";
import { Eoc, EocEffect, Spell, Time } from "CddaJsonFormat";
import { GlobalEventType } from "Event";
import { genActEoc, genEOCID } from "ModDefine";


/**创建触发性效果 */
export function genTriggerEffect(dm:DataManager,effect:Effect,hook:GlobalEventType,eocEffects:EocEffect[]){
    const eocid = `${effect.id}_Trigger`;
    const tiggerEoc=genActEoc(eocid,[
        
        ...eocEffects
    ],undefined,true)
}

/**创建添加效果的法术 */
export function genEffectSpell(spell:Omit<Spell,"effect_str"|"effect">,effectID:EffectID,intensity:number=1,duration:Time=0){
    const eocid = `${spell.id}_AddEffect`;
    const nspell:Spell = UtilFunc.deepClone(spell) as Spell;
    nspell.effect = "effect_on_condition";
    nspell.effect_str = eocid;

    const effecteoc = genActEoc(eocid,[
        {u_add_effect:effectID,intensity,duration}
    ],undefined,true);

    return [nspell,effecteoc];
}