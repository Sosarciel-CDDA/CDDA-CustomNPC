"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEnch = exports.RangeModify = exports.MeleeModify = exports.DefenseModify = exports.NoPain = exports.NO_PAIN_ENCHID = exports.StatMod = exports.STAT_MOD_ENCHID = void 0;
const ModDefine_1 = require("../ModDefine");
const StaticData_1 = require("./StaticData");
/**属性映射附魔 */
const STATUS_VAR_MAP_ENCHID = (0, ModDefine_1.genEnchantmentID)("StatusMap");
const StatusVarMap = {
    id: STATUS_VAR_MAP_ENCHID,
    type: "enchantment",
    has: "WORN",
    condition: "ALWAYS",
    //values:[...EnchGenericValTypeList,...EnchArmorValTypeList].map(modType=>({
    //    value   :modType,
    //    add     :{math:[`u_add_${modType}`]},
    //    multiply:{math:[`u_mul_${modType}`]},
    //}))
    values: []
};
/**属性增强附魔 */
exports.STAT_MOD_ENCHID = (0, ModDefine_1.genEnchantmentID)("StatMod");
exports.StatMod = {
    id: exports.STAT_MOD_ENCHID,
    type: "enchantment",
    condition: "ALWAYS",
    values: [{
            value: "RANGED_DAMAGE",
            //add:{math:["u_val('perception')"]},
            multiply: { math: ["DamageMul(u_val('perception'))-1"] }
        }, {
            value: "MELEE_DAMAGE",
            multiply: { math: ["DamageMul(u_val('strength'))-1"] }
        }, {
            value: "SPEED",
            multiply: { math: ["(DamageMul(u_val('dexterity'))-1)/2"] }
        }]
};
/**无痛附魔 */
exports.NO_PAIN_ENCHID = (0, ModDefine_1.genEnchantmentID)("NoPain");
exports.NoPain = {
    id: exports.NO_PAIN_ENCHID,
    type: "enchantment",
    condition: "ALWAYS",
    values: [{
            value: "PAIN",
            multiply: -1
        }, {
            value: "PAIN_REMOVE",
            add: 1000
        }]
};
/**防御附魔 */
exports.DefenseModify = {
    type: "enchantment",
    id: "DefenseModify",
    name: "防御修正",
    description: "降低 30% 所有伤害, 30% 的概率无视所有伤害。",
    condition: "ALWAYS",
    has: "WIELD",
    values: [
        { value: "FORCEFIELD", add: 0.3 },
        { value: "ARMOR_BASH", multiply: -0.3 },
        { value: "ARMOR_CUT", multiply: -0.3 },
        { value: "ARMOR_STAB", multiply: -0.3 },
        { value: "ARMOR_BULLET", multiply: -0.3 },
        { value: "ARMOR_HEAT", multiply: -0.3 },
        { value: "ARMOR_COLD", multiply: -0.3 },
        { value: "ARMOR_ELEC", multiply: -0.3 },
        { value: "ARMOR_ACID", multiply: -0.3 },
        { value: "ARMOR_BIO", multiply: -0.3 }
    ]
};
/**近战伤害附魔 */
exports.MeleeModify = {
    type: "enchantment",
    id: "MeleeModify",
    name: "近战修正",
    description: "提升 30% 的力量。",
    condition: "ALWAYS",
    has: "WIELD",
    values: [{ value: "STRENGTH", multiply: 0.3 }]
};
/**远程伤害附魔 */
exports.RangeModify = {
    type: "enchantment",
    id: "RangeModify",
    name: "远程修正",
    description: "提升 30% 的感知。",
    condition: "ALWAYS",
    has: "WIELD",
    values: [{ value: "PERCEPTION", multiply: 33.3 }]
};
exports.BaseEnch = [StatusVarMap, exports.StatMod, exports.NoPain, exports.DefenseModify, exports.MeleeModify, exports.RangeModify];
(0, StaticData_1.saveStaticData)(exports.BaseEnch, 'static_resource', 'base_ench');
