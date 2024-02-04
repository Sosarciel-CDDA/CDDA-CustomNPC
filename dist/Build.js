"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const CharBuild_1 = require("./CharBuild");
const DataManager_1 = require("./DataManager");
const CommonBuild_1 = require("./CommonBuild");
const StaticData_1 = require("./StaticData/StaticData");
async function build() {
    const CMDm = new DataManager_1.CDataManager();
    await (0, CharBuild_1.createChar)(CMDm);
    await (0, CommonBuild_1.commonBuild)(CMDm);
    //合并静态数据
    for (const key in StaticData_1.StaticDataMap)
        CMDm.addStaticData(StaticData_1.StaticDataMap[key], key);
    CMDm.saveAllData();
}
exports.build = build;
