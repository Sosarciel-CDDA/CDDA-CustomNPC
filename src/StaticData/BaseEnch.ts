import { EnchArmorValTypeList, EnchGenericValTypeList, Enchantment } from "CddaJsonFormat";
import { genEnchantmentID } from "@src/ModDefine";
import { saveStaticData } from "./StaticData";



/**属性映射附魔 */
export const StatusMap:Enchantment={
    id:genEnchantmentID("StatusMap"),
    type:"enchantment",
    has:"WORN",
    condition:"ALWAYS",
    values:[...EnchGenericValTypeList,...EnchArmorValTypeList].map(modType=>({
        value   :modType,
        add     :{math:[`u_add_${modType}`]},
        multiply:{math:[`u_mul_${modType}`]},
    }))
}
/**感知枪械伤害附魔 */
export const PerRangeDamage:Enchantment={
    id:genEnchantmentID("PerRangeDamage"),
    type:"enchantment",
    has:"WORN",
    condition:"ALWAYS",
    values:[{
        value:"RANGED_DAMAGE",
        add:{math:["u_val('perception')*sqrt(u_val('perception'))"]}
    }]
}

export const BaseEnch = [StatusMap,PerRangeDamage];

saveStaticData('BaseEnch',BaseEnch);