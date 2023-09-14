"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outStaticData = exports.saveStaticData = exports.StaticDataPath = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const DataManager_1 = require("../DataManager");
/**静态数据的目录 */
exports.StaticDataPath = DataManager_1.OUT_PATH;
const StaticDataMap = {};
/**保存静态数据 */
async function saveStaticData(name, data) {
    //const filePath = path.join(StaticDataPath,name);
    //await UtilFT.writeJSONFile(filePath,data);
    //console.log(filePath+" 写入完成")
    StaticDataMap[name] = data;
}
exports.saveStaticData = saveStaticData;
/**输出静态数据 */
async function outStaticData() {
    //复制静态数据
    const staticDataPath = path.join(DataManager_1.DATA_PATH, "StaticData");
    console.log(staticDataPath);
    console.log(DataManager_1.OUT_PATH);
    utils_1.UtilFT.ensurePathExists(staticDataPath, true);
    await fs.promises.cp(staticDataPath, DataManager_1.OUT_PATH, { recursive: true });
    //导出js静态数据
    for (let key in StaticDataMap) {
        let obj = StaticDataMap[key];
        await (0, DataManager_1.outFile)(key, obj);
    }
}
exports.outStaticData = outStaticData;
