import { EocEffect } from "cdda-schema";
/**任何角色的交互事件 列表
 * u为角色 n为怪物
 */
export declare const CCommonInteractiveEventTypeList: readonly ["TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**任何角色的交互事件
 * u为角色 n为怪物
 */
export type CCommonInteractiveEventType = typeof CCommonEventTypeList[number];
/**任何角色通用的事件 列表
 * u为角色 n不存在
 */
export declare const CCommonEventTypeList: readonly ["Update", "TakeDamage", "Death", "EnterBattle", "BattleUpdate", "NonBattleUpdate", "Death", "DeathPrev", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**任何角色通用的事件类型
 * u为角色 n不存在
 */
export type CCommonEventType = typeof CCommonEventTypeList[number];
/**Cnpc角色事件列表
 * u为角色 n不存在
 */
export declare const CCnpcEventTypeList: readonly ["CnpcIdle", "CnpcMove", "CnpcUpdate", "CnpcUpdateSlow", "CnpcInit", "Update", "TakeDamage", "Death", "EnterBattle", "BattleUpdate", "NonBattleUpdate", "Death", "DeathPrev", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**Cnpc角色事件类型 */
export type CCnpcEventType = typeof CCnpcEventTypeList[number];
/**全局的事件列表 */
export declare const CGlobalEventTypeList: readonly ["PlayerUpdate", "GameBegin", "CnpcIdle", "CnpcMove", "CnpcUpdate", "CnpcUpdateSlow", "CnpcInit", "Update", "TakeDamage", "Death", "EnterBattle", "BattleUpdate", "NonBattleUpdate", "Death", "DeathPrev", "TryMeleeHit", "TryRangeHit", "TryHit", "CauseMeleeHit", "MissMeleeHit"];
/**全局事件 */
export type CGlobalEventType = typeof CGlobalEventTypeList[number];
/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect: EocEffect;
    /**排序权重 */
    weight: number;
};
