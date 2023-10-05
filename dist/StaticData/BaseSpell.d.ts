import { Spell } from "../CddaJsonFormat";
/**n格以内算作进入战斗 */
export declare const BATTLE_RANGE = 20;
/**n格以内酸作进入近战 */
export declare const MELEE_RANGE = 3;
/**用于必定成功的控制法术的flags */
export declare const CON_SPELL_FLAG: readonly ["SILENT", "NO_HANDS", "NO_LEGS", "NO_FAIL", "NO_EXPLOSION_SFX"];
export declare const BaseSpell: Spell[];
