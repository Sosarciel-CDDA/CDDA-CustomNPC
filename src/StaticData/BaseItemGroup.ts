import { ItemGroup, genItemGroupID } from "CddaJsonFormat"
import { saveStaticData } from "./StaticData";





/**空物品组 */
export const EmptyGroup:ItemGroup={
    type:"item_group",
    id:genItemGroupID("EmptyGroup"),
    subtype:"collection",
    items:[],
}
export const BaseItemGroup = [EmptyGroup];
saveStaticData("BaseItemGroup",BaseItemGroup);