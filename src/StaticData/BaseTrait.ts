import { Mutation, OverlayOrdering } from "CddaJsonFormat";
import { saveStaticData } from "./StaticData";
import { genMutationID } from "@src/ModDefine";


export const CnpcFlag:Mutation={
    type:"mutation",
    id:genMutationID("CnpcFlag"),
    name:"自定义NPC标识符",
    description:"表示此角色是自定义NPC的NPC,会启用EOC",
    purifiable:false,
    valid:false,
    player_display:false,
    points:0,
}
export const CnpcBaseBody:Mutation={
    type:"mutation",
    id:genMutationID("BaseBody"),
    name:"自定义NPC替代素体",
    description:"代替原素体的贴图变异",
    purifiable:false,
    valid:false,
    player_display:false,
    points:0,
}
//调整素体变异层级到最低
export const BaseBodyOrdering:OverlayOrdering={
    type:"overlay_order",
    overlay_ordering:[
        {id:[genMutationID("BaseBody")],order:0}
    ]
}

export const BaseTrait=[CnpcFlag,CnpcBaseBody,BaseBodyOrdering];
saveStaticData('BaseTrait',BaseTrait);