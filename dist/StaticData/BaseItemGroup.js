"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseItemGroup = exports.EmptyGroup = exports.EMPTY_GROUP_ID = void 0;
const StaticData_1 = require("./StaticData");
const ModDefine_1 = require("../ModDefine");
/**空物品组 ID */
exports.EMPTY_GROUP_ID = (0, ModDefine_1.genItemGroupID)("EmptyGroup");
/**空物品组 */
exports.EmptyGroup = {
    type: "item_group",
    id: exports.EMPTY_GROUP_ID,
    subtype: "collection",
    items: [],
};
exports.BaseItemGroup = [exports.EmptyGroup];
(0, StaticData_1.saveStaticData)(exports.BaseItemGroup, 'static_resource', "base_item_group");
