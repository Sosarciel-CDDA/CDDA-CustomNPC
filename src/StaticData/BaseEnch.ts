import { EnchArmorValTypeList, EnchGenericValTypeList, Enchantment } from "CddaJsonFormat";
import { genEnchantmentID } from "@src/ModDefine";
import { saveStaticData } from "./StaticData";



/**属性映射附魔 */
const STATUS_VAR_MAP_ENCHID = genEnchantmentID("StatusMap");
const StatusVarMap:Enchantment={
    id:STATUS_VAR_MAP_ENCHID,
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
export const STAT_MOD_ENCHID = genEnchantmentID("StatMod");
export const StatMod:Enchantment={
    id:STAT_MOD_ENCHID,
    type:"enchantment",
    condition:"ALWAYS",
    values:[{
        value:"RANGED_DAMAGE",
        add:{math:["u_val('perception')"]},
        multiply:{math:["DamageMul(u_val('perception'))-1"]}
    },{
        value:"MELEE_DAMAGE",
        multiply:{math:["DamageMul(u_val('strength'))-1"]}
    },{
        value:"SPEED",
        multiply:{math:["(DamageMul(u_val('dexterity'))-1)/2"]}
    }]
}

export const BaseEnch = [StatusVarMap,StatMod];

saveStaticData('base_ench',BaseEnch);