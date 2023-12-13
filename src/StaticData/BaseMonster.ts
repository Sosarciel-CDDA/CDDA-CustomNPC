import { Monster } from "cdda-schema";
import { saveStaticData } from "./StaticData";
import { genMonsterID } from "@src/ModDefine";


/**标靶怪物ID */
export const TARGET_MON_ID = genMonsterID("SpellTarget");
/**标靶 */
const Target:Monster = {
    type: "MONSTER",
    id: TARGET_MON_ID,
    name: "法术标靶",
    description: "用于法术瞄准索敌的标靶",
    looks_like: "CNPC_GENERIC_TransparentItem",
    speed: 500,
    hp:1,
    default_faction:"passive_machine",
    symbol:"O",
    weight: 0,
    volume: 0,
    vision_day: 0,
    vision_night: 0,
    aggression: 0,
    morale: 1000,
    flags:["NOHEAD","NO_BREATHE","NO_BREATHE"],
    death_function:{
        corpse_type: "NO_CORPSE",
        message: "",
    }
}

export const BaseMonster = [Target];
saveStaticData(BaseMonster,'static_resource',"base_monster")