"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEoc = exports.FULL_RECIVERY_EOCID = void 0;
const CMDefine_1 = require("../CMDefine");
const StaticData_1 = require("./StaticData");
const BaseSpell_1 = require("./BaseSpell");
/**初始化变量 */
const InitVar = {
    type: "effect_on_condition",
    eoc_type: "ACTIVATION",
    id: CMDefine_1.CMDef.genEOCID("InitVar"),
    effect: [
        { math: [`BATTLE_RANGE`, "=", `${BaseSpell_1.BATTLE_RANGE}`] },
        { math: [`MELEE_RANGE`, "=", `${BaseSpell_1.MELEE_RANGE}`] },
    ]
};
/**完全回复EOC */
exports.FULL_RECIVERY_EOCID = CMDefine_1.CMDef.genEOCID("FullRecovery");
/**完全回复 */
const FullRecivery = {
    type: "effect_on_condition",
    eoc_type: "ACTIVATION",
    id: exports.FULL_RECIVERY_EOCID,
    effect: [
        "u_prevent_death",
        { math: ["u_calories()", "=", "max( u_calories(), 9000)"] },
        { math: ["u_val('thirst')", "=", "min( u_val('thirst'), 800)"] },
        { math: ["u_vitamin('redcells')", "=", "0"] },
        { math: ["u_vitamin('bad_food')", "=", "0"] },
        { math: ["u_vitamin('blood')", "=", "0"] },
        { math: ["u_vitamin('instability')", "=", "0"] },
        { math: ["u_pain()", "=", "0"] },
        { math: ["u_val('rad')", "=", "0"] },
        { math: ["u_hp('ALL')", "=", "999"] },
        //{ u_set_hp: 1000, max: true},
        { u_add_effect: "cureall", duration: "1 s", intensity: 1 },
        { u_add_effect: "panacea", duration: "30 s", intensity: 1 },
        { u_lose_effect: "corroding" },
        { u_lose_effect: "onfire" },
        { u_lose_effect: "dazed" },
        { u_lose_effect: "stunned" },
        { u_lose_effect: "venom_blind" },
        { u_lose_effect: "formication" },
        { u_lose_effect: "blisters" },
        { u_lose_effect: "frostbite" },
        { u_lose_effect: "frostbite_recovery" },
        { u_lose_effect: "wet" },
        { u_lose_effect: "slimed" },
        { u_lose_effect: "migo_atmosphere" },
        { u_lose_effect: "fetid_goop" },
        { u_lose_effect: "sap" },
        { u_lose_effect: "nausea" },
        { u_lose_effect: "bleed" },
    ],
};
exports.BaseEoc = [InitVar, FullRecivery];
(0, StaticData_1.saveStaticData)(exports.BaseEoc, 'static_resource', "base_eoc");
