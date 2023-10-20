"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommonItem = void 0;
const UtilGener_1 = require("./UtilGener");
async function createCommonItem(dm) {
    //await AkasetGauntlet(dm);
}
exports.createCommonItem = createCommonItem;
//Akaset的手套
function AkasetGauntlet(dm) {
    const glove = {
        type: "ARMOR",
        id: "AkasetGauntlet",
        name: { str_sp: "Akaset 的嗜冷生物处理手套" },
        "copy-from": "afs_freeze_gauntlet",
        flags: ["OUTER"]
    };
    const mut = (0, UtilGener_1.genArmorMut)(glove);
    dm.addStaticData([glove, mut], "common_resource", "common_item", "AkasetGauntlet");
}
