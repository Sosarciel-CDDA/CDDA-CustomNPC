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
/**属性增强附魔 */
export const PerRangeDamage:Enchantment={
    id:genEnchantmentID("StatMod"),
    type:"enchantment",
    has:"WORN",
    condition:"ALWAYS",
    values:[{
        value:"RANGED_DAMAGE",
        add:{math:["u_val('perception')"]},
        multiply:{math:["(log(u_val('perception'))*log(u_val('perception')))-1"]}
    },{
        value:"MELEE_DAMAGE",
        multiply:{math:["(log(u_val('strength'))*log(u_val('strength')))-1"]}
    }]
}

export const BaseEnch = [StatusMap,PerRangeDamage];

saveStaticData('BaseEnch',BaseEnch);