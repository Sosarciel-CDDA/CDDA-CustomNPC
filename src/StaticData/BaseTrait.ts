import { Mutation } from "CddaJsonFormat";
import { saveStaticData } from "./StaticData";
import { genMutationID } from "@src/ModDefine";


export const CnpcFlag:Mutation={
    type:"mutation",
    id:genMutationID("CnpcFlag"),
    name:"自定义NPC标识符",
    description:"表示此角色是自定义NPC的NPC,会启用EOC",
    points:0,
}

export const BaseTrait=[CnpcFlag]
saveStaticData('BaseTrait',BaseTrait);