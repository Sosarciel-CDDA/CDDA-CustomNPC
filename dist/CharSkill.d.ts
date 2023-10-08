import { BoolObj } from "./CddaJsonFormat/Eoc";
import { Spell } from "./CddaJsonFormat/Spell";
import { DataManager } from "./DataManager";
import { AnyCharEvenetType } from "./Event";
/**技能选择目标类型 */
type TargetType = "auto" | "random" | "spell_target" | "reverse_hit" | "direct_hit" | "auto_hit";
/**角色技能 */
export type CharSkill = {
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
    /**法术效果 可用{{fieldName}}表示字段变量
     * 如 min_damage: {math:["{{重击}} * 10"]}
     */
    spell: Spell;
    /**技能音效 */
    audio?: (string | {
        /**音效变体ID */
        id: string;
        /**产生音效的概率 1/n 默认1 */
        one_in_chance?: number;
        /**音量 1-128 默认100 */
        volume?: number;
    })[];
    /**要求强化字段 [字段,强化等级] 或 字段名 */
    require_field?: [string, number] | string;
};
/**技能的释放条件 */
export type CastCondition = {
    /**释放条件 若允许多个条件请使用{or:[]}
     * 相同的hook与target将覆盖
     */
    condition?: BoolObj;
    /**时机 */
    hook: AnyCharEvenetType;
    /**瞄准方式
     * auto 为 根据施法目标自动选择;
     * random 为 原版随机;
     * spell_target 为 瞄准目标周围的 攻击时出现的法术标靶 仅适用于攻击触发的范围技能;
     * direct_hit 为 直接命中 使目标使用此法术攻击自己 适用于单体目标技能
     * hook 必须为互动事件 "CharTakeDamage" | "CharTakeRangeDamage" | "CharTakeMeleeDamage" | "CharCauseMeleeHit" | "CharCauseRangeHit" | "CharCauseHit";
     * reverse_hit 为 翻转命中 使目标使用此法术攻击自己 适用于单体目标技能
     * hook 必须为翻转事件 CharCauseDamage | CharCauseMeleeDamage | CharCauseRangeDamage
     * 除 reverse_hit 外无法使用翻转事件;
     * auto_hit 为根据hook在 reverse_hit direct_hit 之间自动判断;
     * 默认为auto
     * 若允许多个CastCondition 请指定具体type
     * 相同的hook与target(包括auto或未指定)将覆盖
     */
    target?: TargetType;
};
/**使某个技能停止使用的变量 */
export declare function stopSpellVar(charName: string, spell: Spell): string;
/**处理角色技能 */
export declare function createCharSkill(dm: DataManager, charName: string): Promise<void>;
export {};
