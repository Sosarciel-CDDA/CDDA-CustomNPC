"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseItemGroup = exports.EmptyGroup = void 0;
const CddaJsonFormat_1 = require("../CddaJsonFormat");
const StaticData_1 = require("./StaticData");
/**空物品组 */
exports.EmptyGroup = {
    type: "item_group",
    id: (0, CddaJsonFormat_1.genItemGroupID)("EmptyGroup"),
    subtype: "collection",
    items: [],
};
exports.BaseItemGroup = [exports.EmptyGroup];
(0, StaticData_1.saveStaticData)("BaseItemGroup", exports.BaseItemGroup);
