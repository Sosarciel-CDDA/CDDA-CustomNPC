import { Spell, FlagID, BoolObj, EocEffect, WeaponCategoryID } from "cdda-schema";
import { DataManager } from "../DataManager";
import { CCharHook } from "../CnpcEvent";
import { SpecEffect } from "./CharSkillSpecEffect";
/**技能选择目标类型 列表 */
declare const TargetTypeList: readonly ["auto", "random", "direct_hit", "filter_random", "control_cast"];
/**技能选择目标类型
 * auto 为 根据施法目标自动选择;
 *
 * random 为 原版随机 适用于自身buff;
 *
 * direct_hit 为 直接命中交互单位 适用于任何目标技能
 * hook 必须为互动事件 "CharTakeDamage" | "CharTakeRangeDamage" | "CharTakeMeleeDamage" | "CharSucessMeleeAttack" | "CharCauseRangeHit" | "CharCauseHit";
 *
 * filter_random 为根据条件筛选可能的目标 命中第一个通过筛选的目标 条件中u为施法者n为目标 适用于队友buff;
 *
 * control_cast 为玩家控制施法 u 为玩家 n 为npc hook字段无效 `${spell.id}_loc` 为玩家选择坐标
 *
 * 默认为auto
 * 若允许多个CastCondition 请指定具体type
 * 相同的hook与target(包括auto或未指定)将覆盖
 */
type TargetType = typeof TargetTypeList[number];
/**角色技能 */
export type CharSkill = {
    /**技能名 */
    name: string;
    /**技能的释放条件 */
    cast_condition: CastCondition | CastCondition[];
    /**权重 优先尝试触发高权重的spell 默认0 */
    weight?: number;
    /**概率 有1/chance的几率使用这个技能 默认1 */
    one_in_chance?: number;
    /**冷却时间 单位为每次CharUpdate 默认0 */
    cooldown?: number;
    /**共同冷却时间 影响所有技能的释放 单位为每次CharUpdate 默认1
     * 一个高权重0共同冷却的技能意味着可以同时触发
     */
    common_cooldown?: number;
    /**法术效果
     * 可用 `u_${字段}` 或 `${角色名}_${字段}` 表示 当前/某个角色 的字段变量
     * 如 min_damage: {math:["u_重击 * 10 + Asuna_重击"]}
     *
     * 可用 `u_${法术id}_cooldown` 获得对应技能冷却
     * 如 {math:["u_fireball_cooldown"]}
     *
     * 可用 u_coCooldown 获得公共冷却时间
     */
    spell: Spell;
    /**子法术
     * 将会随主spell一起解析
     * 作为spell的extra_effects加入
     */
    extra_effect?: Spell[];
    /**特殊的子效果 */
    spec_effect?: SpecEffect[];
    /**技能音效 */
    audio?: (string | {
        /**音效变体ID */
        id: string;
        /**产生音效的概率 1/n 默认1 */
        one_in_chance?: number;
        /**音量 1-128 默认100 */
        volume?: number;
        /**声音冷却
         * 每隔n次战斗刷新可触发
         */
        cooldown?: number;
    })[];
    /**要求强化字段 [字段,强化等级] 或 字段名 */
    require_field?: [string, number] | string;
    /**释放成功后运行的效果 */
    after_effect?: EocEffect[];
    /**尝试释放时就运行的效果 */
    before_effect?: EocEffect[];
    /**需求的武器flag
     * 在角色配置中定义的 武器 会自动生成并添加同ID Flag
     */
    require_weapon_flag?: FlagID[];
    /**需求的武器分类 */
    require_weapon_category?: WeaponCategoryID[];
    /**需求无武器/完全徒手 */
    require_unarmed?: boolean;
};
/**技能的释放条件 */
export type CastCondition = {
    /**释放条件 若允许多个条件请使用{or:[]}
     * 相同的hook与target将覆盖
     */
    condition?: (BoolObj);
    /**时机 */
    hook: CCharHook;
    /**瞄准方式
     * auto 为 根据施法目标自动选择;
     *
     * random 为 原版随机 适用于自身buff;
     *
     * direct_hit 为 直接命中交互单位 适用于任何目标技能
     * hook 必须为互动事件 "CharTakeDamage" | "CharTakeRangeDamage" | "CharTakeMeleeDamage" | "CharSucessMeleeAttack" | "CharCauseRangeHit" | "CharCauseHit";
     *
     * filter_random 为根据条件筛选可能的目标 命中第一个通过筛选的目标 条件中u为施法者n为目标 适用于队友buff;
     *
     * control_cast 为玩家控制施法 u 为玩家 n 为npc hook字段无效 `${spell.id}_loc` 为玩家选择坐标
     *
     * 默认为auto
     * 若允许多个CastCondition 请指定具体type
     * 相同的hook与target(包括auto或未指定)将覆盖
     */
    target?: TargetType;
};
/**使某个技能停止使用的全局变量 */
export declare function getGlobalDisableSpellVar(charName: string, spell: Spell): string;
/**使某个技能停止使用的变量 */
export declare function getDisableSpellVar(talker: "u" | "n", spell: Spell): string;
/**处理角色技能 */
export declare function createCharSkill(dm: DataManager, charName: string): Promise<void>;
/**解析NumObj为math表达式 */
export declare function parseNumObj(value: any): string;
export {};
