"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEnch = exports.PerRangeDamage = exports.StatusMap = void 0;
const CddaJsonFormat_1 = require("../CddaJsonFormat");
const ModDefine_1 = require("../ModDefine");
const StaticData_1 = require("./StaticData");
/**属性映射附魔 */
exports.StatusMap = {
    id: (0, ModDefine_1.genEnchantmentID)("StatusMap"),
    type: "enchantment",
    has: "WORN",
    condition: "ALWAYS",
    values: [...CddaJsonFormat_1.EnchGenericValTypeList, ...CddaJsonFormat_1.EnchArmorValTypeList].map(modType => ({
        value: modType,
        add: { math: [`u_add_${modType}`] },
        multiply: { math: [`u_mul_${modType}`] },
    }))
};
/**感知枪械伤害附魔 */
exports.PerRangeDamage = {
    id: (0, ModDefine_1.genEnchantmentID)("PerRangeDamage"),
    type: "enchantment",
    has: "WORN",
    condition: "ALWAYS",
    values: [{
            value: "RANGED_DAMAGE",
            add: { math: ["u_val('perception')*sqrt(u_val('perception'))"] }
        }]
};
exports.BaseEnch = [exports.StatusMap, exports.PerRangeDamage];
(0, StaticData_1.saveStaticData)('BaseEnch', exports.BaseEnch);
