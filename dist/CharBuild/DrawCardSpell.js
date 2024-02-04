"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDrawCardSpell = void 0;
const CharData_1 = require("../CharBuild/CharData");
const CMDefine_1 = require("../CMDefine");
const UtilGener_1 = require("./UtilGener");
async function createDrawCardSpell(dm) {
    const id = `DrawCardSpell`;
    const cdvar = `${id}_cooldown`;
    const out = [];
    const charDataList = await Promise.all((await (0, CharData_1.getCharList)()).map(charName => {
        return (0, CharData_1.getCharConfig)(charName);
    }));
    const spellRange = 15;
    //卡片集
    const cardGroup = {
        id: CMDefine_1.CMDef.genItemGroupID(`CardDistribution`),
        type: "item_group",
        subtype: "distribution",
        entries: (await (0, CharData_1.getCharList)()).map(charName => ({
            item: (0, UtilGener_1.getCharCardId)(charName),
            prob: 1
        }))
    };
    out.push(cardGroup);
    //主EOC
    const maineoc = {
        type: "effect_on_condition",
        id: `${id}_eoc`,
        eoc_type: "ACTIVATION",
        effect: [
            { u_add_var: cdvar, time: true },
            { u_spawn_item: cardGroup.id, use_item_group: true, suppress_message: true },
        ],
    };
    out.push(maineoc);
    //主法术
    const mainSpell = {
        type: "SPELL",
        id: id,
        name: "抽卡",
        description: "从牌组中抽一张卡。",
        shape: "blast",
        effect: "effect_on_condition",
        effect_str: maineoc.id,
        valid_targets: ["self"]
    };
    out.push(mainSpell);
    dm.addStaticData(out, "common_resource", "DetonateTearSpell");
}
exports.createDrawCardSpell = createDrawCardSpell;
