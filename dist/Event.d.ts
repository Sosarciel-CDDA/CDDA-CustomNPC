import { EocEffect } from "./CddaJsonFormat";
/**任何角色的交互事件 列表
 * u为角色 n为怪物
 */
export declare const CommonInteractiveEventTypeList: readonly ["TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**任何角色的交互事件
 * u为角色 n为怪物
 */
export type CommonInteractiveEventType = typeof CommonEventTypeList[number];
/**任何角色通用的事件 列表
 * u为角色 n不存在
 */
export declare const CommonEventTypeList: readonly ["Update", "TakeDamage", "Death", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**任何角色通用的事件类型
 * u为角色 n不存在
 */
export type CommonEventType = typeof CommonEventTypeList[number];
/**Cnpc角色与怪物互动的事件 列表
 * u为角色 n为怪物
 */
export declare const CnpcInteractiveEventList: readonly ["CnpcTryMeleeHit", "CnpcTryRangeHit", "CnpcTryHit", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**Cnpc角色与怪物互动的事件 */
export type CnpcInteractiveEvent = typeof CnpcInteractiveEventList[number];
/**Cnpc角色事件列表
 * u为角色 n不存在
 */
export declare const CnpcEventTypeList: readonly ["CnpcIdle", "CnpcMove", "CnpcUpdate", "CnpcUpdateSlow", "CnpcInit", "CnpcBattleUpdate", "CnpcNonBattleUpdate", "CnpcDeath", "CnpcDeathPrev", "CnpcDeathAfter", "CnpcEnterBattle", "Update", "TakeDamage", "Death", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit", "CnpcTryMeleeHit", "CnpcTryRangeHit", "CnpcTryHit", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**Cnpc角色事件类型 */
export type CnpcEventType = typeof CnpcEventTypeList[number];
/**任何Cnpc角色事件 列表 */
export declare const AnyCnpcEventTypeList: readonly ["CnpcIdle", "CnpcMove", "CnpcUpdate", "CnpcUpdateSlow", "CnpcInit", "CnpcBattleUpdate", "CnpcNonBattleUpdate", "CnpcDeath", "CnpcDeathPrev", "CnpcDeathAfter", "CnpcEnterBattle", "Update", "TakeDamage", "Death", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit", "CnpcTryMeleeHit", "CnpcTryRangeHit", "CnpcTryHit", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**任何Cnpc角色事件 */
export type AnyCnpcEvenetType = typeof AnyCnpcEventTypeList[number];
/**全局的事件列表 */
export declare const GlobalEventTypeList: readonly ["PlayerUpdate", "GameBegin", "CnpcIdle", "CnpcMove", "CnpcUpdate", "CnpcUpdateSlow", "CnpcInit", "CnpcBattleUpdate", "CnpcNonBattleUpdate", "CnpcDeath", "CnpcDeathPrev", "CnpcDeathAfter", "CnpcEnterBattle", "Update", "TakeDamage", "Death", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit", "CnpcTryMeleeHit", "CnpcTryRangeHit", "CnpcTryHit", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**全局事件 */
export type GlobalEventType = typeof GlobalEventTypeList[number];
/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect: EocEffect;
    /**排序权重 */
    weight: number;
};
