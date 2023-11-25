"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDrawCardSpell = void 0;
const ModDefine_1 = require("../ModDefine");
async function createDrawCardSpell(dm) {
    const id = `DrawCardSpell`;
    const cdvar = `${id}_cooldown`;
    const out = [];
    const charDataList = await Promise.all(dm.charList.map(charName => {
        return dm.getCharData(charName);
    }));
    const spellRange = 15;
    //卡片集
    const cardGroup = {
        id: (0, ModDefine_1.genItemGroupID)(`CardDistribution`),
        type: "item_group",
        subtype: "distribution",
        entries: charDataList.map(cd => ({
            item: cd.defineData.cardID,
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
