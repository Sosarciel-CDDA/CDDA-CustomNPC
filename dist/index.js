"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.buildChar = void 0;
const DataManager_1 = require("./DataManager");
const utils_1 = require("@zwa73/utils");
const CharBuild_1 = require("./CharBuild");
async function buildChar(dm, charName) {
    utils_1.UtilFT.ensurePathExists(dm.getOutCharPath(charName), true);
    await (0, CharBuild_1.mergeImage)(dm, charName, false);
    await (0, CharBuild_1.createAnimTool)(dm, charName);
    await (0, CharBuild_1.createCharClass)(dm, charName);
    await (0, CharBuild_1.createCharEquip)(dm, charName);
    await (0, CharBuild_1.createCharCarry)(dm, charName);
    await (0, CharBuild_1.createAnimStatus)(dm, charName);
    await (0, CharBuild_1.createCharSkill)(dm, charName);
    await (0, CharBuild_1.createCharTalkTopic)(dm, charName);
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
