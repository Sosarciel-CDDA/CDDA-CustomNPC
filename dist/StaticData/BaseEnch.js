"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEnch = exports.NoPain = exports.NO_PAIN_ENCHID = exports.StatMod = exports.STAT_MOD_ENCHID = void 0;
const CddaJsonFormat_1 = require("../CddaJsonFormat");
const ModDefine_1 = require("../ModDefine");
const StaticData_1 = require("./StaticData");
/**属性映射附魔 */
const STATUS_VAR_MAP_ENCHID = (0, ModDefine_1.genEnchantmentID)("StatusMap");
const StatusVarMap = {
    id: STATUS_VAR_MAP_ENCHID,
    type: "enchantment",
    has: "WORN",
    condition: "ALWAYS",
    values: [...CddaJsonFormat_1.EnchGenericValTypeList, ...CddaJsonFormat_1.EnchArmorValTypeList].map(modType => ({
        value: modType,
        add: { math: [`u_add_${modType}`] },
        multiply: { math: [`u_mul_${modType}`] },
    }))
};
/**属性增强附魔 */
exports.STAT_MOD_ENCHID = (0, ModDefine_1.genEnchantmentID)("StatMod");
exports.StatMod = {
    id: exports.STAT_MOD_ENCHID,
    type: "enchantment",
    condition: "ALWAYS",
    values: [{
            value: "RANGED_DAMAGE",
            add: { math: ["u_val('perception')"] },
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
exports.BaseEnch = [StatusVarMap, exports.StatMod];
(0, StaticData_1.saveStaticData)(exports.BaseEnch, 'static_resource', 'base_ench');
