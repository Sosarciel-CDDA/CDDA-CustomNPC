import { EnchArmorValTypeList, EnchGenericValTypeList, Enchantment, EnchantmentID } from "cdda-schema";
import { genEnchantmentID } from "@src/ModDefine";
import { saveStaticData } from "./StaticData";



/**属性映射附魔 */
const STATUS_VAR_MAP_ENCHID = genEnchantmentID("StatusMap");
const StatusVarMap:Enchantment={
    id:STATUS_VAR_MAP_ENCHID,
    type:"enchantment",
    has:"WORN",
    condition:"ALWAYS",
    //values:[...EnchGenericValTypeList,...EnchArmorValTypeList].map(modType=>({
    //    value   :modType,
    //    add     :{math:[`u_add_${modType}`]},
    //    multiply:{math:[`u_mul_${modType}`]},
    //}))
    values:[]
}
/**属性增强附魔 */
export const STAT_MOD_ENCHID = genEnchantmentID("StatMod");
export const StatMod:Enchantment={
    id:STAT_MOD_ENCHID,
    type:"enchantment",
    condition:"ALWAYS",
    values:[{
        value:"RANGED_DAMAGE",
        //add:{math:["u_val('perception')"]},
        multiply:{math:["DamageMul(u_val('perception'))-1"]}
    },{
        value:"MELEE_DAMAGE",
        multiply:{math:["DamageMul(u_val('strength'))-1"]}
    },{
        value:"SPEED",
        multiply:{math:["(DamageMul(u_val('dexterity'))-1)/2"]}
    }]
}
/**无痛附魔 */
export const NO_PAIN_ENCHID = genEnchantmentID("NoPain");
export const NoPain:Enchantment={
    id:NO_PAIN_ENCHID,
    type:"enchantment",
    condition:"ALWAYS",
    values:[{
        value:"PAIN",
        multiply:-1
    },{
        value:"PAIN_REMOVE",
        add:1000
    }]
}

/**防御附魔 */
export const DefenseModify:Enchantment={
    type:"enchantment",
    id:"DefenseModify" as EnchantmentID,
    name:"防御修正",
    description:"降低 30% 所有伤害, 30% 的概率无视所有伤害。",
    condition:"ALWAYS",
    has:"WIELD",
    values:[
        { value : "FORCEFIELD"  , add:0.3 },
        { value : "ARMOR_BASH"  , multiply: -0.3 },
        { value : "ARMOR_CUT"   , multiply: -0.3 },
        { value : "ARMOR_STAB"  , multiply: -0.3 },
        { value : "ARMOR_BULLET", multiply: -0.3 },
        { value : "ARMOR_HEAT"  , multiply: -0.3 },
        { value : "ARMOR_COLD"  , multiply: -0.3 },
        { value : "ARMOR_ELEC"  , multiply: -0.3 },
        { value : "ARMOR_ACID"  , multiply: -0.3 },
        { value : "ARMOR_BIO"   , multiply: -0.3 }
    ]
}
/**近战伤害附魔 */
export const MeleeModify:Enchantment={
    type:"enchantment",
    id:"MeleeModify" as EnchantmentID,
    name:"近战修正",
    description:"提升 30% 的力量。",
    condition:"ALWAYS",
    has:"WIELD",
    values:[{value:"STRENGTH", multiply:0.3}]
}
/**远程伤害附魔 */
export const RangeModify:Enchantment={
    type:"enchantment",
    id:"RangeModify" as EnchantmentID,
    name:"远程修正",
    description:"提升 30% 的感知。",
    condition:"ALWAYS",
    has:"WIELD",
    values:[{value:"PERCEPTION", multiply:33.3}]
}

export const BaseEnch = [StatusVarMap,StatMod,NoPain,DefenseModify,MeleeModify,RangeModify];

saveStaticData(BaseEnch,'static_resource','base_ench');