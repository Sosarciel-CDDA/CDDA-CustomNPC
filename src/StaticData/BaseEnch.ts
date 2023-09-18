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

export const BaseEnch = [StatusMap];

saveStaticData('BaseEnch',BaseEnch);