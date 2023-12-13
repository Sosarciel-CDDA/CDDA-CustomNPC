import { DataManager } from "../DataManager";
import { Flag } from "../CddaJsonFormat";
/**附魔集 */
type EnchSet = {
    /**主要标志 */
    main: Flag;
    /**强度标志 */
    lvl: Flag[];
};
export declare function createEnchItem(dm: DataManager): Promise<void>;
export declare function knockback(dm: DataManager): Promise<EnchSet>;
export declare function enchTest(dm: DataManager, enchSets: EnchSet[]): Promise<void>;
export {};
