"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveStaticData = exports.StaticDataMap = void 0;
exports.StaticDataMap = {};
/**保存静态数据 */
async function saveStaticData(filePath, data) {
    //const filePath = path.join(StaticDataPath,name);
    //await UtilFT.writeJSONFile(filePath,data);
    //console.log(filePath+" 写入完成")
    exports.StaticDataMap[filePath] = data;
}
exports.saveStaticData = saveStaticData;
