"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genNpcClassID = void 0;
const Data_1 = require("../Data");
/**生成适用于此mod的 NPC职业ID */
function genNpcClassID(id) {
    return `${Data_1.MOD_PREFIX}_NPCLASS_${id}`;
}
exports.genNpcClassID = genNpcClassID;
