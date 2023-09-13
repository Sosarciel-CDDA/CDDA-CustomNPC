"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorList = exports.ArmorFlagList = exports.ArmorLayerList = exports.genArmorID = void 0;
const DataManager_1 = require("../DataManager");
/**生成适用于此mod的ARMOR ID */
function genArmorID(id) {
    return `${DataManager_1.MOD_PREFIX}_ARMOR_${id}`;
}
exports.genArmorID = genArmorID;
/**装甲图层显示优先级 从低到高 AURA显示在最外层 */
exports.ArmorLayerList = ["PERSONAL", "SKINTIGHT", "NORMAL", "WAIST", "OUTER", "BELTED", "AURA"];
exports.ArmorFlagList = ["INTEGRATED", "ALLOWS_NATURAL_ATTACKS", "BLOCK_WHILE_WORN", "UNBREAKABLE", "OUTER"];
exports.ColorList = ["blue", "white", "brown", "dark_gray"];
