import { Spell } from "cdda-schema";
/**n格以内算作进入战斗/远程攻击范围 */
export declare const BATTLE_RANGE = 30;
/**n格以内算作进入近战 */
export declare const MELEE_RANGE = 3;
/**最大法术伤害 */
export declare const SPELL_MAX_DAMAGE = 10000000;
/**施法后摇法术ID */
export declare const SPELL_CT_MODMOVE: import("cdda-schema").SpellID;
/**施法后摇变量 */
export declare const SPELL_CT_MODMOVE_VAR = "casttime_modmove";
/**加速一回合 */
export declare const SPELL_M1T: import("cdda-schema").SpellID;
/**用于必定成功的控制法术的flags */
export declare const CON_SPELL_FLAG: readonly ["SILENT", "NO_HANDS", "NO_LEGS", "NO_FAIL", "NO_EXPLOSION_SFX"];
export declare const BaseSpell: Spell[];
