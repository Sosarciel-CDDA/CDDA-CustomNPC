import { JToken } from '@zwa73/utils';
/**mod物品前缀 */
export declare const MOD_PREFIX = "CNPC";
/**资源目录 */
export declare const DATA_PATH: string;
/**角色目录 */
export declare const CHAR_PATH: string;
/**角色列表 */
export declare const CHAR_LIST: string[];
/**获取 角色目录 */
export declare function getCharPath(charName: string): string;
/**输出目录 */
export declare const OUT_PATH: string;
/**获取 输出角色目录 */
export declare function getOutCharPath(charName: string): string;
/**输出数据到角色目录 */
export declare function outCharFile(charName: string, filePath: string, obj: JToken): Promise<void>;
/**输出数据到主目录 */
export declare function outFile(filePath: string, obj: JToken): Promise<void>;
/**修改输入输出路径 */
export declare function modPath(dataPath: string, outPath: string): void;
