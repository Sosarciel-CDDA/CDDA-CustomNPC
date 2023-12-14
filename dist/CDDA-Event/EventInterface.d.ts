import { Eoc, EocEffect, EocType } from "@/cdda-schema";
/**角色互动事件 列表 */
export declare const InteractiveEventTypeList: readonly ["MeleeAttackChar", "MeleeAttackMons", "RangeAttackChar", "RangeAttackMons", "MeleeAttack", "RangeAttack", "Attack", "CauseMeleeHit", "MissMeleeHit"];
/**角色互动事件
 * u为角色 n为目标角色
 */
export type InteractiveEventType = typeof InteractiveEventTypeList[number];
/**任何角色事件 列表*/
export declare const CharEventTypeList: readonly ["MeleeAttackChar", "MeleeAttackMons", "RangeAttackChar", "RangeAttackMons", "MeleeAttack", "RangeAttack", "Attack", "CauseMeleeHit", "MissMeleeHit", "Update", "SlowUpdate", "TakeDamage", "Death", "EnterBattle", "BattleUpdate", "NonBattleUpdate"];
/**任何角色事件
 * u为角色 n未定义
 */
export type CharEventType = typeof CharEventTypeList[number];
/**全局事件列表 列表 */
export declare const GlobalEventTypeList: readonly ["AvaterMove", "AvaterUpdate", "GameBegin"];
/**全局事件
 * u为主角 n未定义
 */
export type GlobalEventType = typeof GlobalEventTypeList[number];
/**任何事件 列表 */
export declare const AnyEventTypeList: readonly ["AvaterMove", "AvaterUpdate", "GameBegin", "MeleeAttackChar", "MeleeAttackMons", "RangeAttackChar", "RangeAttackMons", "MeleeAttack", "RangeAttack", "Attack", "CauseMeleeHit", "MissMeleeHit", "Update", "SlowUpdate", "TakeDamage", "Death", "EnterBattle", "BattleUpdate", "NonBattleUpdate"];
/**任何事件
 * u n 均未定义
 */
export type AnyEventType = typeof AnyEventTypeList[number];
export type EventObj = {
    /**基础设置 */
    base_setting: {
        /**eoc类型 */
        eoc_type: EocType;
        /**event依赖 */
        required_event?: string;
        /**刷新间隔/秒 */
        recurrence?: number;
        /**全局刷新 */
        global?: true;
        /**运行于npc */
        run_for_npcs?: true;
    };
    /**运行此事件时将会附带调用的EocEffect */
    invoke_effects?: EocEffect[];
    /**关联事件 */
    link_events?: AnyEventType[];
};
export declare function genEventEoc(prefix: string): Record<AnyEventType, Eoc>;
