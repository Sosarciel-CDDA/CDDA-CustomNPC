import { JArray, JObject } from "@zwa73/utils";
import { Time } from "./GenericDefine";


/**EOC */
export type EOC = {
	type: "effect_on_condition";
	/**唯一ID */
	id: string;
	/**eoc类型 */
	eoc_type: EocType,
	/**效果 */
	effect?: JArray;
	/**启用条件 */
	condition?: JObject;
	/**循环间隔 */
	recurrence?: Time;
	/**是否可在NPC上运行 */
	global?:boolean,
	/**是否可在NPC上运行 global生效时才可用 */
	run_for_npcs?:boolean,
};
/**EOC类型 列表 */
export const EocTypeList = [
	"EVENT",
	"ACTIVATION",
	"RECURRING",
	"OM_MOVE",
] as const;
/**EOC类型 */
export type EocType = typeof EocTypeList[number];