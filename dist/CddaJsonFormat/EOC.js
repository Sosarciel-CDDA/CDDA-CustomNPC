"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEOCID = void 0;
const Data_1 = require("../Data");
/**生成适用于此mod的 EOC ID */
function genEOCID(id) {
    return `${Data_1.MOD_PREFIX}_NPC_${id}`;
}
exports.genEOCID = genEOCID;
