"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTest = void 0;
const UtilGener_1 = require("./UtilGener");
const ModDefine_1 = require("../ModDefine");
async function createTest(dm) {
    let outData = [];
    const effid = (0, ModDefine_1.genEffectID)("TestEff");
    const eff = {
        id: effid,
        type: "effect_type",
        name: ["测试触发效果"],
        max_intensity: 1000,
    };
    outData.push((0, UtilGener_1.genTriggerEffect)(dm, eff, "TakeDamage", "-1", [], 120));
    outData.push(eff);
    const eoc = (0, UtilGener_1.genAddEffEoc)(effid, 120);
    const spell = {
        id: (0, ModDefine_1.genSpellID)("effecTest"),
        type: "SPELL",
        valid_targets: ["self"],
        shape: "blast",
        name: "测试效果法术",
        description: "测试效果法术",
        effect: "effect_on_condition",
        effect_str: eoc.id
    };
    outData.push(eoc, spell);
    dm.addStaticData(outData, "test");
}
exports.createTest = createTest;
