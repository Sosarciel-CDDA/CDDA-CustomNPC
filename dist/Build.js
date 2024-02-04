"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const CharBuild_1 = require("./CharBuild");
const DataManager_1 = require("./DataManager");
const CommonBuild_1 = require("./CommonBuild");
async function build() {
    const CMDm = new DataManager_1.CDataManager();
    await (0, CharBuild_1.createChar)(CMDm);
    await (0, CommonBuild_1.commonBuild)(CMDm);
}
exports.build = build;
