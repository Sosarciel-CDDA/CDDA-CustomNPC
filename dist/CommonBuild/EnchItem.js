"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnchItem = void 0;
const ModDefine_1 = require("../ModDefine");
function createEnchItem(dm) {
    const out = [];
    const ActiveEnchEocID = (0, ModDefine_1.genEOCID)("ActiveEnch");
    const testItem = {
        id: "mc_longsword",
        type: "TOOL",
        "copy-from": "mc_longsword",
        extend: {
            flags: ["ACTIVATE_ON_PLACE"]
        },
        use_action: {
            type: "effect_on_conditions",
            description: "激活附魔",
            effect_on_conditions: [ActiveEnchEocID]
        }
    };
    out.push(testItem);
    const ActiveEnchEoc = {
        id: ActiveEnchEocID,
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        effect: [
            { math: ["n_isActiveEnch", "=", "1"] }
        ],
        condition: { math: ["n_isActiveEnch", "!=", "1"] }
    };
    out.push(ActiveEnchEoc);
    dm.addStaticData(out, "common_resource", "DetonateTearSpell");
}
exports.createEnchItem = createEnchItem;
