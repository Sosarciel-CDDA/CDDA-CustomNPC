"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSpellID = void 0;
const DataManager_1 = require("../DataManager");
/**生成适用于此mod的 法术ID */
function genSpellID(id) {
    return `${DataManager_1.MOD_PREFIX}_SPELL_${id}`;
}
exports.genSpellID = genSpellID;
