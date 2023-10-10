import { ItemGroup } from "CddaJsonFormat"
import { saveStaticData } from "./StaticData";
import { genItemGroupID } from "@src/ModDefine";





/**空物品组 */
export const EmptyGroup:ItemGroup={
    type:"item_group",
    id:genItemGroupID("EmptyGroup"),
    subtype:"collection",
    items:[],
}
export const BaseItemGroup = [EmptyGroup];
saveStaticData("base_item_group",BaseItemGroup);