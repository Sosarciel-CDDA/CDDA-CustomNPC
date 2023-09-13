"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genItemGroupID = void 0;
const DataManager_1 = require("../DataManager");
/**生成适用于此mod的 物品组ID */
function genItemGroupID(id) {
    return `${DataManager_1.MOD_PREFIX}_MUT_${id}`;
}
exports.genItemGroupID = genItemGroupID;
