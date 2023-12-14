import { EocEffect } from "cdda-schema";
/**任何角色的交互事件 列表
 * u为角色 n为怪物
 */
export declare const CInteractHookList: readonly ["TryMeleeAttack", "TryRangeAttack", "TryAttack", "SucessMeleeAttack", "MissMeleeAttack"];
/**任何角色的交互事件
 * u为角色 n为怪物
 */
export type CInteractHook = typeof CInteractHookList[number];
/**任何角色通用的事件 列表
 * u为角色 n不存在
 */
export declare const CCharHookList: readonly ["Update", "TakeDamage", "EnterBattle", "BattleUpdate", "NonBattleUpdate", "Death", "DeathPrev", "SlowUpdate", "Init", "IdleStatus", "MoveStatus", "TryMeleeAttack", "TryRangeAttack", "TryAttack", "SucessMeleeAttack", "MissMeleeAttack"];
/**任何角色通用的事件类型
 * u为角色 n不存在
 */
export type CCharHook = typeof CCharHookList[number];
/**全局的事件列表 */
export declare const CGlobalHookList: readonly ["AvatarUpdate", "GameBegin", "Update", "TakeDamage", "EnterBattle", "BattleUpdate", "NonBattleUpdate", "Death", "DeathPrev", "SlowUpdate", "Init", "IdleStatus", "MoveStatus", "TryMeleeAttack", "TryRangeAttack", "TryAttack", "SucessMeleeAttack", "MissMeleeAttack"];
/**全局事件 */
export type CGlobalHook = typeof CGlobalHookList[number];
/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect: EocEffect;
    /**排序权重 */
    weight: number;
};
export declare function buildEventFrame(): import("@zwa73/utils").JObject[];
