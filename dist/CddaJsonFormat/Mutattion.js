"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genMutationID = void 0;
const DataManager_1 = require("../DataManager");
/**生成适用于此mod的 变异ID */
function genMutationID(id) {
    return `${DataManager_1.MOD_PREFIX}_MUT_${id}`;
}
exports.genMutationID = genMutationID;
