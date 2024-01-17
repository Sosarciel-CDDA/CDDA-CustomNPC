"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTest = void 0;
const UtilGener_1 = require("./UtilGener");
const CMDefine_1 = require("../CMDefine");
async function createTest(dm) {
    let outData = [];
    const effid = CMDefine_1.CMDef.genEffectID("TestEff");
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
        id: CMDefine_1.CMDef.genSpellID("effecTest"),
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
