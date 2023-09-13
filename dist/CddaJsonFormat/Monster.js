"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterFlagList = exports.genMonsterID = void 0;
const DataManager_1 = require("../DataManager");
/**生成适用于此mod的 怪物ID */
function genMonsterID(id) {
    return `${DataManager_1.MOD_PREFIX}_MON_${id}`;
}
exports.genMonsterID = genMonsterID;
/**怪物可用的Flag 列表 */
exports.MonsterFlagList = [
    "SEES",
    "HEARS",
    "NOHEAD",
    "HARDTOSHOOT",
    "FLIES",
    "PRIORITIZE_TARGETS",
    "NO_BREATHE",
    "NOGIB", //这个怪物被超量伤害杀死时不会爆成碎块
];
