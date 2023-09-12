import { NpcClass, NpcInstance } from "..";
import { saveStaticData } from "./StaticData";



const BaseNpcClass:NpcClass={
    type:'npc_class',
    id:"CNPC_NPCLASS_BaseNpcClass",
    name:"BaseNpcClass",
    job_description:"基础NPC职业",
    common:false,
    traits:[
        {"trait": ""}
    ]
}
const BaseNpcInstance:NpcInstance={
    type:"npc",
    id:"CNPC_NPC_BaseNpc",
    class:"CNPC_NPCLASS_BaseNpcClass",
    attitude: 0,
    mission: 0,
    faction: "your_followers",
}
export const BaseNpc = [BaseNpcClass,BaseNpcInstance];

saveStaticData('BaseNpc',BaseNpc);