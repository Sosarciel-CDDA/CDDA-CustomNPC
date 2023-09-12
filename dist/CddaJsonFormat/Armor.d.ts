import { BodyPart } from "./Mutattion";
/**生成适用于此mod的ARMOR ID */
export declare function genArmorID(id: string): string;
/**一件护甲 */
export type Armor = {
    type: "ARMOR";
    /**衣物还是盔甲 */
    category: "armor" | "clothing";
    id: string;
    name: string;
    /**描述 */
    description: string;
    /**重量 */
    weight: number | `${number} ${"kg" | "g"}`;
    /**体积 */
    volume: number | `${number} ${"L" | "ml"}`;
    /**物品价格 */
    price?: number | `${number} usd`;
    /**大灾变后的物品价格 */
    price_postapoc?: number | `${number} usd`;
    material?: string[];
    /**ascii显示符号 */
    symbol?: string;
    /**颜色 */
    color?: string;
    /**保暖度 */
    warmth?: number;
    /**环境保护 */
    environmental_protection?: number;
    flags?: ArmorFlag[];
    armor: ArmorData[];
};
export type ArmorData = {
    material?: [{
        type: "leather";
        covered_by_mat: 100;
        thickness: 1;
    }];
    /**覆盖 主肢体id */
    covers?: BodyPart[];
    /**特殊覆盖 子肢体id */
    specifically_covers?: BodyPart[];
    /**覆盖率 */
    coverage?: number;
    /**累赘度 [每件累赘度, 多件累赘度惩罚]  重复穿着3件时 [0]*3+[1] */
    encumbrance?: number | [number, number];
    /**显示层级 */
    layers?: ArmorLayer[];
};
/**装甲图层显示优先级 从低到高 AURA显示在最外层 */
export declare const ArmorLayerList: readonly ["PERSONAL", "SKINTIGHT", "NORMAL", "WAIST", "OUTER", "BELTED", "AURA"];
/**装甲图层 */
export type ArmorLayer = typeof ArmorLayerList[number];
export declare const ArmorFlagList: readonly ["INTEGRATED", "ALLOWS_NATURAL_ATTACKS", "BLOCK_WHILE_WORN", "UNBREAKABLE", "OUTER"];
export type ArmorFlag = typeof ArmorFlagList[number];
export declare const ColorList: readonly ["blue", "white", "brown", "dark_gray"];
export type Color = typeof ColorList[number];
