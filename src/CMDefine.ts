import { UtilFT } from "@zwa73/utils";
import { ModDefine } from "cdda-schema";
import * as path from 'path';

/**mod物品前缀 */
export const MOD_PREFIX = "CNPC";

export const CMDef = new ModDefine(MOD_PREFIX);

/**data文件夹路径 */
export const DATA_PATH = path.join(process.cwd(),'data');
/**角色列表文件夹路径 */
export const CHARS_PATH = path.join(DATA_PATH,"Chars");
/**sosarcielEnv文件夹路径 */
export const ENV_PATH = path.join(process.cwd(),'..');
/**build设定 */
const BuilfSetting = UtilFT.loadJSONFileSync(path.join(ENV_PATH,'build_setting.json'));
/**build目标游戏路径 */
export const GAME_PATH = BuilfSetting.game_path as string;
/**build输出路径 */
export const OUT_PATH = path.join(GAME_PATH,'data','mods','CustomNPC');

/**SmartNpc 施法数据输出路径 */
export const CASTAI_PATH = path.join(ENV_PATH,"CDDA-SmartNPC","data","CastAI","cnpc");
/**获取角色的施法AI数据输出路径 */
export const getCharCastAIPath = (charName:string)=>path.join(CASTAI_PATH,charName);
/**SmartNpc 施法法术数据输出路径 */
export const CASTSPELL_PATH = path.join(ENV_PATH,"CDDA-SmartNPC","spell","CustomNPC");
/**获取角色的施法AI数据输出路径 */
export const getCharCastSpellPath = (charName:string)=>path.join(CASTSPELL_PATH,charName);

/**获取角色路径 */
export const getCharPath = (charName:string) => path.join(DATA_PATH,"Chars",charName);
/**角色绝对输出路径 */
export const getCharOutPathAbs = (charName:string) => path.join(OUT_PATH,"Chars",charName);
/**角色输出路径 */
export const getCharOutPath = (charName:string) => path.join("Chars",charName);