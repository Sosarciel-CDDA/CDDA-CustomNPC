import { EocEffect, EocType } from "cdda-schema";
/**角色互动事件 列表 */
export declare const InteractHookList: readonly ["TryMeleeAtkChar", "TryMeleeAtkMon", "TryRangeAtkChar", "TryRangeAtkMon", "TryMeleeAttack", "TryRangeAttack", "TryAttack", "SucessMeleeAttack", "MissMeleeAttack"];
/**角色互动事件
 * u为角色 n为目标角色
 */
export type InteractHook = typeof InteractHookList[number];
/**任何角色事件 列表*/
export declare const CharHookList: readonly ["TryMeleeAtkChar", "TryMeleeAtkMon", "TryRangeAtkChar", "TryRangeAtkMon", "TryMeleeAttack", "TryRangeAttack", "TryAttack", "SucessMeleeAttack", "MissMeleeAttack", "Init", "Update", "SlowUpdate", "TakeDamage", "DeathPrev", "Death", "EnterBattle", "LeaveBattle", "BattleUpdate", "NonBattleUpdate", "MoveStatus", "IdleStatus", "AttackStatus"];
/**任何角色事件
 * u为角色 n未定义
 */
export type CharHook = typeof CharHookList[number];
/**全局事件列表 列表 */
export declare const GlobalHookList: readonly ["AvatarMove", "AvatarUpdate", "GameBegin"];
/**全局事件
 * u为主角 n未定义
 */
export type GlobalHook = typeof GlobalHookList[number];
/**任何事件 列表 */
export declare const AnyEventTypeList: readonly ["AvatarMove", "AvatarUpdate", "GameBegin", "TryMeleeAtkChar", "TryMeleeAtkMon", "TryRangeAtkChar", "TryRangeAtkMon", "TryMeleeAttack", "TryRangeAttack", "TryAttack", "SucessMeleeAttack", "MissMeleeAttack", "Init", "Update", "SlowUpdate", "TakeDamage", "DeathPrev", "Death", "EnterBattle", "LeaveBattle", "BattleUpdate", "NonBattleUpdate", "MoveStatus", "IdleStatus", "AttackStatus"];
/**任何事件
 * u n 均未定义
 */
export type AnyHook = typeof AnyEventTypeList[number];
/**一个Hook */
export type HookObj = {
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
    /**运行此事件前将会附带调用的EocEffect */
    before_effects?: EocEffect[];
    /**运行此事件后将会附带调用的EocEffect */
    after_effects?: EocEffect[];
};
export declare function genDefineHookMap(prefix: string, statusDur?: number, battleDur?: number, slowCounter?: number): Record<"TryMeleeAtkChar" | "TryMeleeAtkMon" | "TryRangeAtkChar" | "TryRangeAtkMon" | "TryMeleeAttack" | "TryRangeAttack" | "TryAttack" | "SucessMeleeAttack" | "MissMeleeAttack" | "Init" | "Update" | "SlowUpdate" | "TakeDamage" | "DeathPrev" | "Death" | "EnterBattle" | "LeaveBattle" | "BattleUpdate" | "NonBattleUpdate" | "MoveStatus" | "IdleStatus" | "AttackStatus" | "AvatarMove" | "AvatarUpdate" | "GameBegin", HookObj>;
