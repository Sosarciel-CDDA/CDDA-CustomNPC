import { CddaID } from "./GenericDefine";
import { AnyItemID } from "./Item";


export const DefineAmmoTypeIDList = [
    "50"    ,
    "500"   ,
] as const;
export type DefineAmmoTypeID = typeof DefineAmmoTypeIDList[number];

/**弹药ID格式  */
export type AmmunitionTypeID = CddaID<"AMMUNIT">|DefineAmmoTypeID;
/**弹药类型 */
export type AmmunitionType = {
	type: "ammunition_type";
    /**唯一ID */
	id: AmmunitionTypeID;
    /**弹药名称 */
	name: string;
    /**弹药的默认物品ID */
	default: AnyItemID;
};

