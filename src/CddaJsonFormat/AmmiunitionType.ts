import { CddaID } from "./GenericDefine";


export const DefineAmmoTypeIDList = [
    "50"    ,
    "500"   ,
] as const;
export type DefineAmmoTypeID = typeof DefineAmmoTypeIDList[number];

/**材质ID格式
 */
export type AmmunitionTypeID = CddaID<"AMMUT">|DefineAmmoTypeID;
/**材质类型 */
export type AmmunitionType = {
	type: "ammunition_type";
    /**唯一ID */
	id: AmmunitionTypeID;
    /**材质名称 */
	name: string;
    /**材质的默认物品ID */
	default: string;
};

