"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonBuild = void 0;
const Test_1 = require("./Test");
const TriggerEffect_1 = require("./TriggerEffect");
const CommonItem_1 = require("./CommonItem");
const DivinationSpell_1 = require("./DivinationSpell");
const DrawCardSpell_1 = require("./DrawCardSpell");
const CommonDamageType_1 = require("./CommonDamageType");
const TriggerFlag_1 = require("./TriggerFlag");
const EnchItem_1 = require("./EnchItem");
/**构建通用数据 */
async function commonBuild(dm) {
    await (0, Test_1.createTest)(dm);
    await (0, TriggerEffect_1.createTriggerEffect)(dm);
    await (0, CommonItem_1.createCommonItem)(dm);
    await (0, DivinationSpell_1.createDivinationSpell)(dm);
    await (0, DrawCardSpell_1.createDrawCardSpell)(dm);
    await (0, CommonDamageType_1.createDamageType)(dm);
    await (0, TriggerFlag_1.createTriggerFlag)(dm);
    await (0, EnchItem_1.createEnchItem)(dm);
}
exports.commonBuild = commonBuild;
