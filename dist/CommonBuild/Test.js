"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTest = void 0;
const UtilGener_1 = require("./UtilGener");
const ModDefine_1 = require("../ModDefine");
function createTest(dm) {
    let outData = [];
    const effid = (0, ModDefine_1.genEffectID)("TestEff");
    outData.push(...(0, UtilGener_1.genTriggerEffect)(dm, {
        id: effid,
        type: "effect_type",
        name: ["测试触发效果"],
        max_intensity: 1000,
    }, "TakeDamage", [], 120));
    outData.push(...(0, UtilGener_1.genEffectSpell)({
        id: (0, ModDefine_1.genSpellID)("effecTest"),
        type: "SPELL",
        valid_targets: ["self"],
        shape: "blast",
        name: "测试效果法术",
        description: "测试效果法术",
    }, effid, 10, 120));
    dm.addStaticData(outData, "test");
}
exports.createTest = createTest;
