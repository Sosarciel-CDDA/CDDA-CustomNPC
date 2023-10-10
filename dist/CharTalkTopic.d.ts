import { AnyItem } from ".";
import { DataManager } from "./DataManager";
/**创建对话选项 */
export declare function createCharTalkTopic(dm: DataManager, charName: string): Promise<void>;
/**使某个武器停止使用的全局变量 */
export declare function getGlobalDisableWeaponVar(charName: string, item: AnyItem): string;
/**使某个武器停止使用的变量 */
export declare function getTalkerDisableWeaponVar(talker: "u" | "n", item: AnyItem): string;
