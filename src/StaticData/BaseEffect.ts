import { Effect } from "cdda-schema";
import { genEffectID } from "@src/ModDefine";
import { saveStaticData } from "./StaticData";





/**取消逃跑效果 */
const Courage:Effect={
    type:"effect_type",
    id:genEffectID("Courage"),
    name:["勇气"],
    desc:["npc不会逃跑"],
    removes_effects:["npc_run_away"],
}

const BaseEffect = [Courage];

saveStaticData(BaseEffect,'static_resource',"base_effect");