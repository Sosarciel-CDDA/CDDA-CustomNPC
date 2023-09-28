"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeItem = exports.SOUL_DUST_ID = void 0;
const ModDefine_1 = require("../ModDefine");
const StaticData_1 = require("./StaticData");
const BaseSpell_1 = require("./BaseSpell");
/**经验物品ID */
exports.SOUL_DUST_ID = (0, ModDefine_1.genGenericID)("SoulDust");
/**使用灵魂之尘的eocid */
const UseSoulDustEocID = (0, ModDefine_1.genEOCID)("UseSoulDust");
/**使用灵魂之尘的法术id */
const UseSoulDustSpellID = (0, ModDefine_1.genSpellID)("UseSoulDust");
/**升级法术 */
const UseSoulDust = {
    type: "SPELL",
    name: "使用灵魂之尘",
    description: "使用灵魂之尘触发的法术",
    effect: "effect_on_condition",
    effect_str: UseSoulDustEocID,
    valid_targets: ["ally"],
    min_range: BaseSpell_1.BATTLE_RANGE,
    shape: "blast",
    id: UseSoulDustSpellID,
    flags: [...BaseSpell_1.CON_SPELL_FLAG],
};
/**经验物品 */
const SoulDust = {
    type: "GENERIC",
    id: exports.SOUL_DUST_ID,
    name: { str_sp: "灵魂之尘" },
    description: "用于给角色提升经验",
    volume: 0,
    weight: 0,
    symbol: "O",
    flags: ["ZERO_WEIGHT", "UNBREAKABLE"],
};
/**升级道具 */
exports.UpgradeItem = [SoulDust, UseSoulDust];
(0, StaticData_1.saveStaticData)("UpgradeItem", exports.UpgradeItem);
