import { BoolObj } from "./CddaJsonFormat/Eoc";
import { Spell } from "./CddaJsonFormat/Spell";
import { CharEventType, DataManager } from "./DataManager";
/**角色技能 */
export type CharSkill = {
    /**释放条件 */
    condition?: BoolObj;
    /**时机 */
    hook: CharEventType;
    /**瞄准方式
     * random 为 原版随机
     * spell_target 为 瞄准目标周围的 攻击时出现的法术标靶 仅适用于攻击触发的范围技能
     * 默认为根据施法目标自动选择
     */
    target?: "random" | "spell_target";
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
export declare function createCharSkill(dm: DataManager, charName: string): Promise<void>;
