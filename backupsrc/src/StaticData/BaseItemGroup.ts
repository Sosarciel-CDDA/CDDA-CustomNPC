import { ItemGroup } from "@sosarciel-cdda/schema"
import { saveStaticData } from "./StaticData";
import { CMDef } from "CMDefine";



/**空物品组 ID */
export const EMPTY_GROUP_ID = CMDef.genItemGroupID("EmptyGroup");
/**空物品组 */
export const EmptyGroup:ItemGroup={
    type:"item_group",
    id:EMPTY_GROUP_ID,
    subtype:"collection",
    items:[],
}
export const BaseItemGroup = [EmptyGroup];
saveStaticData(BaseItemGroup,'static_resource',"base_item_group");