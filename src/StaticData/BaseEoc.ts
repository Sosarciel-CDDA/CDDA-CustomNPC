import { Eoc } from "@src/CddaJsonFormat";
import { genEOCID, genEffectID } from "@src/ModDefine";
import { saveStaticData } from "./StaticData";
import { BATTLE_RANGE, MELEE_RANGE } from "./BaseSpell";





/**初始化变量 */
export const InitVar:Eoc={
    type:"effect_on_condition",
    eoc_type:"ACTIVATION",
    id:genEOCID("InitVar"),
    effect:[
        {math:[`BATTLE_RANGE`,"=",`${BATTLE_RANGE}`]},
        {math:[`MELEE_RANGE` ,"=",`${MELEE_RANGE}` ]},
    ]
}

export const BaseEoc = [InitVar];

saveStaticData("base_eoc",BaseEoc);