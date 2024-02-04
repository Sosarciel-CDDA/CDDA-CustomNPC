import { ModDefine } from "cdda-schema";
/**mod物品前缀 */
export declare const MOD_PREFIX = "CNPC";
export declare const CMDef: ModDefine;
/**data文件夹路径 */
export declare const DATA_PATH: string;
/**角色列表文件夹路径 */
export declare const CHARS_PATH: string;
/**sosarcielEnv文件夹路径 */
export declare const ENV_PATH: string;
/**build目标游戏路径 */
export declare const GAME_PATH: string;
/**build输出路径 */
export declare const OUT_PATH: string;
/**SmartNpc 施法数据输出路径 */
export declare const CASTAI_PATH: string;
/**获取角色的施法AI数据输出路径 */
export declare const getCharCastAIPath: (charName: string) => string;
/**SmartNpc 施法法术数据输出路径 */
export declare const CASTSPELL_PATH: string;
/**获取角色的施法AI数据输出路径 */
export declare const getCharCastSpellPath: (charName: string) => string;
/**获取角色路径 */
export declare const getCharPath: (charName: string) => string;
/**角色输出路径 */
export declare const getCharOutPath: (charName: string) => string;
