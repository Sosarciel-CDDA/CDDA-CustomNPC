import { Spell } from "..";
/**n格以内算作进入战斗 */
export declare const BATTLE_RANGE = 20;
/**用于必定成功的控制法术的flags */
export declare const ControlSpellFlags: readonly ["SILENT", "NO_HANDS", "NO_LEGS", "NO_FAIL"];
export declare const BaseSpell: Spell[];
