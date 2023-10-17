"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMonster = exports.TARGET_MON_ID = void 0;
const StaticData_1 = require("./StaticData");
const ModDefine_1 = require("../ModDefine");
/**标靶怪物ID */
exports.TARGET_MON_ID = (0, ModDefine_1.genMonsterID)("SpellTarget");
/**标靶 */
const Target = {
    type: "MONSTER",
    id: exports.TARGET_MON_ID,
    name: "法术标靶",
    description: "用于法术瞄准索敌的标靶",
    looks_like: "CNPC_GENERIC_TransparentItem",
    speed: 500,
    hp: 1,
    default_faction: "passive_machine",
    symbol: "O",
    weight: 0,
    volume: 0,
    vision_day: 0,
    vision_night: 0,
    aggression: 0,
    morale: 1000,
    flags: ["NOHEAD", "NO_BREATHE", "NO_BREATHE"],
    death_function: {
        corpse_type: "NO_CORPSE",
        message: "",
    }
};
exports.BaseMonster = [Target];
(0, StaticData_1.saveStaticData)(exports.BaseMonster, 'static_resource', "base_monster");
