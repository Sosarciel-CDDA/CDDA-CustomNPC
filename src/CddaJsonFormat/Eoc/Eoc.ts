import { CddaID, Time } from "../GenericDefine";
import { BoolObj } from "./VariableObject";
import { EocEffect } from "./EocEffect";
import { JObject } from "@zwa73/utils";



/**EOC ID格式
 * @TJS-type string
 */
export type EocID = CddaID<"EOC">;
/**EOC */
export type Eoc = {
	type: "effect_on_condition";
	/**唯一ID */
	id: EocID;
	/**eoc类型 */
	eoc_type: EocType,
	/**效果 */
	effect?: EocEffect[];
	/**启用条件 */
	condition?: BoolObj;
	/**循环间隔 */
	recurrence?: Time;
	/**是否可在NPC上运行 */
	global?:boolean,
	/**是否可在NPC上运行 global生效时才可用 */
	run_for_npcs?:boolean,
};
/**EOC类型 列表 */
export const EocTypeList = [
	"EVENT"				,//事件
	"ACTIVATION"		,//被动触发
	"RECURRING"			,//循环触发
	"OM_MOVE"			,//主角移动
	"SCENARIO_SPECIFIC" ,//场景启动时自动调用一次
	"AVATAR_DEATH"		,//主角死亡
	"NPC_DEATH"			,//NPC死亡
	"PREVENT_DEATH"		,//主角死亡
] as const;
/**EOC类型 */
export type EocType = typeof EocTypeList[number];

/**内联EOC */
export type InlineEoc = Omit<Eoc,"type">;



/**创建U与NPC的变体 */
export type TalkerVar<B extends JObject,K extends string> =
    (Omit<B,K>&{[P in `npc_${K}`]:B[K]}&{[P in `u_${K}`]?:never})|
    (Omit<B,K>&{[P in `u_${K}`]:B[K]}&{[P in `npc_${K}`]?:never});