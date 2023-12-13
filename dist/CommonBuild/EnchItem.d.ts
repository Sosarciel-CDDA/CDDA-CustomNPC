import { DataManager } from "../DataManager";
import { Flag } from "cdda-schema";
/**附魔集 */
type EnchSet = {
    /**主要标志 */
    main: Flag;
    /**强度变体数据集 */
    lvl: {
        /**附魔标志 */
        ench: Flag;
        /**随机权重 */
        weight: number;
    }[];
};
export declare function createEnchItem(dm: DataManager): Promise<void>;
export declare function knockback(dm: DataManager): Promise<EnchSet>;
export declare function enchTest(dm: DataManager, enchSets: EnchSet[]): Promise<void>;
export {};
