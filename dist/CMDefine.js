"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharOutPath = exports.getCharOutPathAbs = exports.getCharPath = exports.getCharCastSpellPath = exports.CASTSPELL_PATH = exports.getCharCastAIPath = exports.CASTAI_PATH = exports.OUT_PATH = exports.GAME_PATH = exports.ENV_PATH = exports.CHARS_PATH = exports.DATA_PATH = exports.CMDef = exports.MOD_PREFIX = void 0;
const utils_1 = require("@zwa73/utils");
const cdda_schema_1 = require("cdda-schema");
const path = require("path");
/**mod物品前缀 */
exports.MOD_PREFIX = "CNPC";
exports.CMDef = new cdda_schema_1.ModDefine(exports.MOD_PREFIX);
/**data文件夹路径 */
exports.DATA_PATH = path.join(process.cwd(), 'data');
/**角色列表文件夹路径 */
exports.CHARS_PATH = path.join(exports.DATA_PATH, "Chars");
/**sosarcielEnv文件夹路径 */
exports.ENV_PATH = path.join(process.cwd(), '..');
/**build设定 */
const BuilfSetting = utils_1.UtilFT.loadJSONFileSync(path.join(exports.ENV_PATH, 'build_setting.json'));
/**build目标游戏路径 */
exports.GAME_PATH = BuilfSetting.game_path;
/**build输出路径 */
exports.OUT_PATH = path.join(exports.GAME_PATH, 'data', 'mods', 'CustomNPC');
/**SmartNpc 施法数据输出路径 */
exports.CASTAI_PATH = path.join(exports.ENV_PATH, "CDDA-SmartNPC", "data", "CastAI", "cnpc");
/**获取角色的施法AI数据输出路径 */
const getCharCastAIPath = (charName) => path.join(exports.CASTAI_PATH, charName);
exports.getCharCastAIPath = getCharCastAIPath;
/**SmartNpc 施法法术数据输出路径 */
exports.CASTSPELL_PATH = path.join(exports.ENV_PATH, "CDDA-SmartNPC", "spell", "CustomNPC");
/**获取角色的施法AI数据输出路径 */
const getCharCastSpellPath = (charName) => path.join(exports.CASTSPELL_PATH, charName);
exports.getCharCastSpellPath = getCharCastSpellPath;
/**获取角色路径 */
const getCharPath = (charName) => path.join(exports.DATA_PATH, "Chars", charName);
exports.getCharPath = getCharPath;
/**角色绝对输出路径 */
const getCharOutPathAbs = (charName) => path.join(exports.OUT_PATH, "Chars", charName);
exports.getCharOutPathAbs = getCharOutPathAbs;
/**角色输出路径 */
const getCharOutPath = (charName) => path.join("Chars", charName);
exports.getCharOutPath = getCharOutPath;
