"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEoc = exports.InitVar = void 0;
const ModDefine_1 = require("../ModDefine");
const StaticData_1 = require("./StaticData");
const BaseSpell_1 = require("./BaseSpell");
/**初始化变量 */
exports.InitVar = {
    type: "effect_on_condition",
    eoc_type: "ACTIVATION",
    id: (0, ModDefine_1.genEOCID)("InitVar"),
    effect: [
        { math: [`BATTLE_RANGE`, "=", `${BaseSpell_1.BATTLE_RANGE}`] },
        { math: [`MELEE_RANGE`, "=", `${BaseSpell_1.MELEE_RANGE}`] },
    ]
};
exports.BaseEoc = [exports.InitVar];
(0, StaticData_1.saveStaticData)(exports.BaseEoc, 'static_resource', "base_eoc");
