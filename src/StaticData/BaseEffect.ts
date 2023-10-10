import { Effect } from "@src/CddaJsonFormat/Effect";
import { genEffectID } from "@src/ModDefine";
import { saveStaticData } from "./StaticData";





/**取消逃跑效果 */
export const Courage:Effect={
    type:"effect_type",
    id:genEffectID("Courage"),
    name:["勇气"],
    desc:["npc不会逃跑"],
    removes_effects:["npc_run_away"],
}

export const BaseEffect = [Courage];

saveStaticData("base_effect",BaseEffect);