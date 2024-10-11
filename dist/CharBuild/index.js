"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChar = createChar;
const CharData_1 = require("./CharData");
const CharCarry_1 = require("./CharCarry");
const CharClass_1 = require("./CharClass");
const CharEquip_1 = require("./CharEquip");
const CharGener_1 = require("./CharGener");
const CharTalkTopic_1 = require("./CharTalkTopic");
const CharSkill_1 = require("./CharSkill");
const DrawCardSpell_1 = require("./DrawCardSpell");
/**创建角色 */
async function createChar(dm) {
    const charList = await (0, CharData_1.getCharList)();
    (0, DrawCardSpell_1.createDrawCardSpell)(dm);
    for (const charName of charList) {
        await (0, CharCarry_1.createCharCarry)(dm, charName);
        await (0, CharClass_1.createCharClass)(dm, charName);
        await (0, CharEquip_1.createCharEquip)(dm, charName);
        await (0, CharGener_1.createCharGener)(dm, charName);
        await (0, CharSkill_1.createCharSkill)(dm, charName);
        await (0, CharTalkTopic_1.createCharTalkTopic)(dm, charName);
    }
}
