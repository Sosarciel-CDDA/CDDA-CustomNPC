import { Effect } from "@sosarciel-cdda/sclema";
import { CMDef } from "CMDefine";
import { saveStaticData } from "./StaticData";





/**取消逃跑效果 */
const Courage:Effect={
    type:"effect_type",
    id:CMDef.genEffectID("Courage"),
    name:["勇气"],
    desc:["npc不会逃跑"],
    removes_effects:["npc_run_away"],
}

const BaseEffect = [Courage];

saveStaticData(BaseEffect,'static_resource',"base_effect");