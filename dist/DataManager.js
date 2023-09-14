"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modPath = exports.outFile = exports.outCharFile = exports.getOutCharPath = exports.OUT_PATH = exports.getCharPath = exports.CHAR_LIST = exports.CHAR_PATH = exports.DATA_PATH = exports.MOD_PREFIX = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
/**mod物品前缀 */
exports.MOD_PREFIX = "CNPC";
/**资源目录 */
exports.DATA_PATH = path.join(process.cwd(), 'data');
/**角色目录 */
exports.CHAR_PATH = path.join(exports.DATA_PATH, 'chars');
/**角色列表 */
exports.CHAR_LIST = fs.readdirSync(exports.CHAR_PATH).filter(fileName => {
    const filePath = getCharPath(fileName);
    if (fs.statSync(filePath).isDirectory())
        return true;
});
/**获取 角色目录 */
function getCharPath(charName) {
    return path.join(exports.CHAR_PATH, charName);
}
exports.getCharPath = getCharPath;
/**输出目录 */
exports.OUT_PATH = path.join(process.cwd(), 'CustomNPC');
/**获取 输出角色目录 */
function getOutCharPath(charName) {
    return path.join(exports.OUT_PATH, 'chars', charName);
}
exports.getOutCharPath = getOutCharPath;
/**输出数据到角色目录 */
async function outCharFile(charName, filePath, obj) {
    return utils_1.UtilFT.writeJSONFile(path.join(getOutCharPath(charName), filePath), obj);
}
exports.outCharFile = outCharFile;
/**输出数据到主目录 */
async function outFile(filePath, obj) {
    return utils_1.UtilFT.writeJSONFile(path.join(exports.OUT_PATH, filePath), obj);
}
exports.outFile = outFile;
/**修改输入输出路径 */
function modPath(dataPath, outPath) {
    //@ts-ignore
    exports.DATA_PATH = dataPath;
    //@ts-ignore
    exports.OUT_PATH = outPath;
}
exports.modPath = modPath;
