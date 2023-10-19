import { EocEffect } from "./CddaJsonFormat";
/**Cnpc角色与怪物互动的事件 列表
 * u为角色 n为怪物
 */
export declare const CnpcInteractiveEventList: readonly ["CnpcCheckTakeDamage", "CnpcCheckTakeRangeDamage", "CnpcCheckTakeMeleeDamage", "CnpcCheckCauseMeleeHit", "CnpcCheckCauseRangeHit", "CnpcCheckCauseHit"];
/**Cnpc角色与怪物互动的事件 */
export type CnpcInteractiveEvent = typeof CnpcInteractiveEventList[number];
/**任何角色通用的事件列表
 * u为角色 n不存在
 */
export declare const CommonEventTypeList: readonly ["Update", "TryMeleeHit", "TryRangeHit", "TryHit", "TakeDamage", "CauseMeleeHit", "MissMeleeHit"];
/**任何角色通用的事件类型
 * u为角色 n不存在
 */
export type CommonEventType = typeof CommonEventTypeList[number];
/**Cnpc角色事件列表
 * u为角色 n不存在
 */
export declare const CnpcEventTypeList: readonly ["CnpcIdle", "CnpcMove", "CnpcUpdate", "CnpcUpdateSlow", "CnpcInit", "CnpcBattleUpdate", "CnpcNonBattleUpdate", "CnpcDeath", "CnpcDeathPrev", "CnpcDeathAfter", "CnpcEnterBattle", "Update", "TryMeleeHit", "TryRangeHit", "TryHit", "TakeDamage", "CauseMeleeHit", "MissMeleeHit", "CnpcCheckTakeDamage", "CnpcCheckTakeRangeDamage", "CnpcCheckTakeMeleeDamage", "CnpcCheckCauseMeleeHit", "CnpcCheckCauseRangeHit", "CnpcCheckCauseHit"];
/**Cnpc角色事件类型 */
export type CnpcEventType = typeof CnpcEventTypeList[number];
/**Cnpc角色的 反转Talker的角色事件列表
 * 对应同名CauseDamage
 * n为角色 u为受害者
 */
export declare const CnpcReverseEventTypeList: readonly ["CnpcCheckCauseDamage", "CnpcCheckCauseMeleeDamage", "CnpcCheckCauseRangeDamage"];
/**Cnpc角色的 反转Talker的角色事件类型
 * 对应同名CauseDamage
 */
export type CnpcReverseEventType = typeof CnpcReverseEventTypeList[number];
/**任何Cnpc角色事件 列表 */
export declare const AnyCnpcEventTypeList: readonly ["CnpcIdle", "CnpcMove", "CnpcUpdate", "CnpcUpdateSlow", "CnpcInit", "CnpcBattleUpdate", "CnpcNonBattleUpdate", "CnpcDeath", "CnpcDeathPrev", "CnpcDeathAfter", "CnpcEnterBattle", "Update", "TryMeleeHit", "TryRangeHit", "TryHit", "TakeDamage", "CauseMeleeHit", "MissMeleeHit", "CnpcCheckTakeDamage", "CnpcCheckTakeRangeDamage", "CnpcCheckTakeMeleeDamage", "CnpcCheckCauseMeleeHit", "CnpcCheckCauseRangeHit", "CnpcCheckCauseHit", "CnpcCheckCauseDamage", "CnpcCheckCauseMeleeDamage", "CnpcCheckCauseRangeDamage"];
/**任何Cnpc角色事件 */
export type AnyCnpcEvenetType = typeof AnyCnpcEventTypeList[number];
/**全局的事件列表 */
export declare const GlobalEventTypeList: readonly ["PlayerUpdate", "GameBegin", "CnpcIdle", "CnpcMove", "CnpcUpdate", "CnpcUpdateSlow", "CnpcInit", "CnpcBattleUpdate", "CnpcNonBattleUpdate", "CnpcDeath", "CnpcDeathPrev", "CnpcDeathAfter", "CnpcEnterBattle", "Update", "TryMeleeHit", "TryRangeHit", "TryHit", "TakeDamage", "CauseMeleeHit", "MissMeleeHit", "CnpcCheckTakeDamage", "CnpcCheckTakeRangeDamage", "CnpcCheckTakeMeleeDamage", "CnpcCheckCauseMeleeHit", "CnpcCheckCauseRangeHit", "CnpcCheckCauseHit", "CnpcCheckCauseDamage", "CnpcCheckCauseMeleeDamage", "CnpcCheckCauseRangeDamage"];
/**全局事件 */
export type GlobalEventType = typeof GlobalEventTypeList[number];
/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect: EocEffect;
    /**排序权重 */
    weight: number;
};
