"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutCharPath = exports.OUT_PATH = exports.getCharPath = exports.CHAR_LIST = exports.DATA_PATH = void 0;
const path = require("path");
const fs = require("fs");
/**资源目录 */
exports.DATA_PATH = path.join(process.cwd(), 'data');
/**角色列表 */
exports.CHAR_LIST = fs.readdirSync(exports.DATA_PATH).filter(fileName => {
    const filePath = getCharPath(fileName);
    if (fs.statSync(filePath).isDirectory())
        return true;
});
/**获取 角色目录 */
function getCharPath(charName) {
    return path.join(exports.DATA_PATH, charName);
}
exports.getCharPath = getCharPath;
/**输出目录 */
exports.OUT_PATH = path.join(process.cwd(), 'CustomNPC');
/**获取 输出角色目录 */
function getOutCharPath(charName) {
    return path.join(exports.OUT_PATH, 'chars', charName);
}
exports.getOutCharPath = getOutCharPath;
