import { ItemGroup } from "CddaJsonFormat"
import { saveStaticData } from "./StaticData";
import { genItemGroupID } from "@src/ModDefine";



/**空物品组 ID */
export const EMPTY_GROUP_ID = genItemGroupID("EmptyGroup");
/**空物品组 */
export const EmptyGroup:ItemGroup={
    type:"item_group",
    id:EMPTY_GROUP_ID,
    subtype:"collection",
    items:[],
}
export const BaseItemGroup = [EmptyGroup];
saveStaticData("base_item_group",BaseItemGroup);