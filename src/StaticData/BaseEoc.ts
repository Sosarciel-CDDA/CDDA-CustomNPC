import { Eoc } from "cdda-schema";
import { genEOCID, genEffectID } from "@src/ModDefine";
import { saveStaticData } from "./StaticData";
import { BATTLE_RANGE, MELEE_RANGE } from "./BaseSpell";





/**初始化变量 */
const InitVar:Eoc={
    type:"effect_on_condition",
    eoc_type:"ACTIVATION",
    id:genEOCID("InitVar"),
    effect:[
        {math:[`BATTLE_RANGE`,"=",`${BATTLE_RANGE}`]},
        {math:[`MELEE_RANGE` ,"=",`${MELEE_RANGE}` ]},
    ]
}

/**完全回复EOC */
export const FULL_RECIVERY_EOCID = genEOCID("FullRecovery");
/**完全回复 */
const FullRecivery:Eoc={
    type:"effect_on_condition",
    eoc_type:"ACTIVATION",
    id:FULL_RECIVERY_EOCID,
    effect:[
        "u_prevent_death",
        { math: [ "u_val('stored_kcal')", "=", "max( u_val('stored_kcal'), 9000)"   ] },
        { math: [ "u_val('thirst')"     , "=", "min( u_val('thirst'), 800)"         ] },
        { math: [ "u_val('vitamin', 'name: redcells')"      , "=", "0" ] },
        { math: [ "u_val('vitamin', 'name: bad_food')"      , "=", "0" ] },
        { math: [ "u_val('vitamin', 'name: blood')"         , "=", "0" ] },
        { math: [ "u_val('vitamin', 'name: instability')"   , "=", "0" ] },
        { math: [ "u_pain()"    , "=", "0" ] },
        { math: [ "u_val('rad')", "=", "0" ] },
        { u_set_hp: 1000, max: true},
        { u_add_effect: "cureall", duration: "1 s", intensity: 1 },
        { u_lose_effect: "corroding"             },
        { u_lose_effect: "onfire"                },
        { u_lose_effect: "dazed"                 },
        { u_lose_effect: "stunned"               },
        { u_lose_effect: "venom_blind"           },
        { u_lose_effect: "formication"           },
        { u_lose_effect: "blisters"              },
        { u_lose_effect: "frostbite"             },
        { u_lose_effect: "frostbite_recovery"    },
        { u_lose_effect: "wet"                   },
        { u_lose_effect: "slimed"                },
        { u_lose_effect: "migo_atmosphere"       },
        { u_lose_effect: "fetid_goop"            },
        { u_lose_effect: "sap"                   },
        { u_lose_effect: "nausea"                },
        { u_lose_effect: "bleed"                 },
    ]
}
export const BaseEoc = [InitVar,FullRecivery];
saveStaticData(BaseEoc,'static_resource',"base_eoc");