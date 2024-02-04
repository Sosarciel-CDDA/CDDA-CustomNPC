import { UtilFT } from "@zwa73/utils";
import { ModDefine } from "cdda-schema";
import * as path from 'path';

/**mod物品前缀 */
export const MOD_PREFIX = "CNPC";

export const CMDef = new ModDefine(MOD_PREFIX);

/**data文件夹路径 */
export const DATA_PATH = path.join(process.cwd(),'data');
/**sosarcielEnv文件夹路径 */
export const ENV_PATH = path.join(process.cwd(),'..');
/**build设定 */
const BuilfSetting = UtilFT.loadJSONFileSync(path.join(ENV_PATH,'build_setting.json'));
/**build目标游戏路径 */
export const GAME_PATH = BuilfSetting.game_path as string;
/**build输出路径 */
export const OUT_PATH = path.join(GAME_PATH,'data','mods','CustomNPC');

/**获取角色路径 */
export const getCharPath = (charName:string) => path.join(DATA_PATH,charName);
/**角色输出路径 */
export const getCharOutPath = (charName:string) => path.join(OUT_PATH,charName);