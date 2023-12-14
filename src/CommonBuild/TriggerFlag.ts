import { DataManager } from "@src/DataManager";
import { DamageType, DamageTypeID, Effect, EffectID, Eoc, Flag, FlagID, Spell } from "cdda-schema";
import { genActEoc, genEOCID, genSpellID } from "ModDefine";
import { genDIO } from "./UtilGener";
import { SPELL_CT_MODMOVE, SPELL_CT_MODMOVE_VAR, SPELL_MAX_DAMAGE } from "StaticData";
import { JObject } from "@zwa73/utils";


export async function createTriggerFlag(dm:DataManager){
    await shotInterval(dm);
}
/**射击间隔 */
async function shotInterval(dm:DataManager){
    const baseId = "SHOTINT" as const;
    const numVar = [30,70,100,140,1000] as const;
    const outlist:JObject[] = [];
    for(let num of numVar){
        const flagid = `${baseId}_${num}` as FlagID;
        const flag:Flag = {
            type:"json_flag",
            id:flagid
        }
        const triggerEoc = genActEoc(flagid,[
            {math:[SPELL_CT_MODMOVE_VAR,"=",num+""]},
            {u_cast_spell:{id:SPELL_CT_MODMOVE,hit_self:true}},
        ],{u_has_wielded_with_flag:flagid});
        dm.addEvent("TryRangeAttack",0,triggerEoc);
        outlist.push(flag,triggerEoc);
    }
    dm.addStaticData([...outlist],"common_resource","trigger_flag","shot_interval");
}
