import { BoolObj } from "./CddaJsonFormat/Eoc";
import { Spell } from "./CddaJsonFormat/Spell";
import { CharEventType, DataManager } from "./DataManager";
/**角色技能 */
export type CharSkill = {
    /**释放条件 */
    condition?: BoolObj;
    /**时机 */
    hook: CharEventType;
    /**权重 优先尝试触发高权重的spell 默认0 */
    weight?: number;
    /**概率 有1/chance的几率使用这个技能 默认1 */
    chance?: number;
    /**法术效果 */
    spell: Spell;
};
export declare function createCharSkill(dm: DataManager, charName: string): Promise<void>;
