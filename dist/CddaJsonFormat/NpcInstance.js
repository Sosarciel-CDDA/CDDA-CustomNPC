"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genNpcInstanceID = void 0;
const DataManager_1 = require("../DataManager");
/**生成适用于此mod的 NPCID */
function genNpcInstanceID(id) {
    return `${DataManager_1.MOD_PREFIX}_NPC_${id}`;
}
exports.genNpcInstanceID = genNpcInstanceID;
