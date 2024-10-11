"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticDataMap = void 0;
exports.saveStaticData = saveStaticData;
const path = require("path");
exports.StaticDataMap = {};
/**保存静态数据 */
async function saveStaticData(data, filePath, ...filePaths) {
    //const filePath = path.join(StaticDataPath,name);
    //await UtilFT.writeJSONFile(filePath,data);
    //console.log(filePath+" 写入完成")
    exports.StaticDataMap[path.join(filePath, ...filePaths)] = data;
}
