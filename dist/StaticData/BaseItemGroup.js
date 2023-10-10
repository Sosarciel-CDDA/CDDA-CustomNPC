"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseItemGroup = exports.EmptyGroup = void 0;
const StaticData_1 = require("./StaticData");
const ModDefine_1 = require("../ModDefine");
/**空物品组 */
exports.EmptyGroup = {
    type: "item_group",
    id: (0, ModDefine_1.genItemGroupID)("EmptyGroup"),
    subtype: "collection",
    items: [],
};
exports.BaseItemGroup = [exports.EmptyGroup];
(0, StaticData_1.saveStaticData)("base_item_group", exports.BaseItemGroup);
