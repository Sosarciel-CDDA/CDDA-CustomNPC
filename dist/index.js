"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.buildChar = void 0;
const DataManager_1 = require("./DataManager");
const MergeImage_1 = require("./MergeImage");
const CharClass_1 = require("./CharClass");
const AnimTool_1 = require("./AnimTool");
const CharEquip_1 = require("./CharEquip");
const AnimStatus_1 = require("./AnimStatus");
const utils_1 = require("@zwa73/utils");
const CharSkill_1 = require("./CharSkill");
const CharTalkTopic_1 = require("./CharTalkTopic");
async function buildChar(dm, charName) {
    utils_1.UtilFT.ensurePathExists(dm.getOutCharPath(charName), true);
    await (0, MergeImage_1.mergeImage)(dm, charName, false);
    await (0, AnimTool_1.createAnimTool)(dm, charName);
    await (0, CharClass_1.createCharClass)(dm, charName);
    await (0, CharEquip_1.createCharEquip)(dm, charName);
    await (0, AnimStatus_1.createAnimStatus)(dm, charName);
    await (0, CharSkill_1.createCharSkill)(dm, charName);
    await (0, CharTalkTopic_1.createCharTalkTopic)(dm, charName);
}
exports.buildChar = buildChar;
async function main() {
    const dm = await DataManager_1.DataManager.create();
    const plist = [];
    for (let charName of dm.charList)
        plist.push(buildChar(dm, charName));
    await Promise.all(plist);
    await dm.saveAllData();
}
exports.main = main;
main();
__exportStar(require("./StaticData"), exports);
__exportStar(require("./CddaJsonFormat"), exports);
__exportStar(require("./ModDefine"), exports);
