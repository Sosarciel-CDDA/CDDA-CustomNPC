import { CddaID } from "./GenericDefine";
/**材质ID格式
 */
export type AmmiunitionTypeID = CddaID<"AMMITYPE">;
/**材质类型 */
export type AmmiunitionType = {
    type: "ammunition_type";
    /**唯一ID */
    id: AmmiunitionTypeID;
    /**材质名称 */
    name: string;
    /**材质的默认物品ID */
    default: string;
};
