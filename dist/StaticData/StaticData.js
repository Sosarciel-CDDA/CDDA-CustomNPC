"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveStaticData = exports.StaticDataPath = void 0;
const path = require("path");
const utils_1 = require("@zwa73/utils");
/**静态数据的目录 */
exports.StaticDataPath = path.join(process.cwd(), 'CustomNpc');
/**保存静态数据 */
async function saveStaticData(name, data) {
    const filePath = path.join(exports.StaticDataPath, name);
    await utils_1.UtilFT.writeJSONFile(filePath, data);
    console.log(filePath + " 写入完成");
}
exports.saveStaticData = saveStaticData;
