import { BoolObj } from "./CddaJsonFormat/Eoc";
import { Spell } from "./CddaJsonFormat/Spell";
import { DataManager } from "./DataManager";
import { CharEventType, ReverseCharEventType } from "./Event";
/**技能选择目标类型 */
type TargetType = "random" | "spell_target" | "reverse_hit";
/**角色技能 */
export type CharSkill = {
    /**释放条件 */
    condition?: BoolObj;
    /**时机 */
    hook: CharEventType | ReverseCharEventType;
    /**瞄准方式
     * random 为 原版随机;
     * spell_target 为 瞄准目标周围的 攻击时出现的法术标靶 仅适用于攻击触发的范围技能;
     * reverse_hit 为 翻转命中 使目标使用此法术攻击自己 并用u_hp-=造成伤害 适用于单体技能
     * hook 必须为翻转事件 CharCauseDamage | CharCauseMeleeDamage | CharCauseRangeDamage
     * 除 reverse_hit 外无法使用翻转事件;
     * 默认为根据施法目标自动选择 reverse_hit 不会被自动选择
     */
    target?: TargetType;
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
    /**法术效果 */
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
    /**要求强化字段 [字段,强化等级] */
    require_field?: [string, number];
};
/**处理角色技能 */
export declare function createCharSkill(dm: DataManager, charName: string): Promise<void>;
export {};
