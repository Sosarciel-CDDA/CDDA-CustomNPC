import { Armor, Enchantment, Eoc, Flag, Gun, ItemGroup, Mutation, NumObj, EnchModVal, BodyPartList } from "CddaJsonFormat";
import { DataManager } from "./DataManager";
import { genEOCID, genEnchantmentID } from "./ModDefine";
import { getTalkerFieldVarID, parseEnchStatTable } from "./CharConfig";
import { JObject } from "@zwa73/utils";





/**创建角色装备 */
export async function createCharEquip(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);

    /**构造附魔属性 */
    /**基础附魔 */
    const baseEnch:Enchantment={
        id:defineData.baseEnchID,
        type:"enchantment",
        condition:"ALWAYS",
        values:parseEnchStatTable(charConfig.ench_status)
    }

    //字段附魔
    const enchList:Enchantment[] = [];
    for(const upgObj of charConfig.upgrade||[]){
        const field = upgObj.field;
        const ufield = getTalkerFieldVarID("u",field);
        /**字段基础附魔 */
        const fdBaseEnch:Enchantment={
            id:genEnchantmentID(`${field}_base`),
            type:"enchantment",
            condition:"ALWAYS",
            values:parseEnchStatTable(upgObj.ench_status)
                .map(item=>{
                    const {value,add,multiply} = item;
                    let out:EnchModVal = {value};
                    if(add) out.add = {math:[`min(1,${ufield})*(${add.math[0]})`]}
                    if(multiply) out.multiply = {math:[`min(1,${ufield})*(${multiply.math[0]})`]}
                    return out;
                })
        }
        /**字段等级附魔 */
        const fdLvlEnch:Enchantment={
            id:genEnchantmentID(`${field}_lvl`),
            type:"enchantment",
            condition:"ALWAYS",
            values:parseEnchStatTable(upgObj.lvl_ench_status)
                .map(item=>{
                    const {value,add,multiply} = item;
                    let out:EnchModVal = {value};
                    if(add) out.add = {math:[`${ufield}*(${add.math[0]})`]}
                    if(multiply) out.multiply = {math:[`${ufield}*(${multiply.math[0]})`]}
                    return out;
                })
        }
        if(parseEnchStatTable(upgObj.ench_status).length>0){
            dm.addSharedRes("common_ench",fdBaseEnch.id,fdBaseEnch);
            enchList.push(fdBaseEnch);
        }
        if(parseEnchStatTable(upgObj.lvl_ench_status).length>0){
            dm.addSharedRes("common_ench",fdLvlEnch.id,fdLvlEnch);
            enchList.push(fdLvlEnch);
        }
    }
    /**基础装备 */
    const baseArmor:Armor={
        type        : "ARMOR",
        id          : defineData.baseArmorID,
        name        : `${charName}的基础装备`,
        description : `${charName}的基础装备`,
        category    : "clothing",
        weight      : 0,
        volume      : 0,
        symbol      : "O",
        flags       : [
            "PERSONAL"      ,//个人层
            "UNBREAKABLE"   ,//不会损坏
            "INTEGRATED"    ,//自体护甲
            "ZERO_WEIGHT"   ,//无重量体积
            "TARDIS"        ,//不会出售
            "PARTIAL_DEAF"  ,//降低音量到安全水平
        ],
        pocket_data : (charConfig.weapon
            ? [{
                rigid: true,
                pocket_type: "CONTAINER",
                max_contains_volume: "100 L",
                max_contains_weight: "100 kg",
                moves: 1,
                fire_protection: true,
                max_item_length: "1 km",
                weight_multiplier: 0,
                volume_multiplier: 0,
                item_restriction:charConfig.weapon.map(item=>item.id)
            }]
            : undefined),
    }

    /**基础变异 */
    const baseMut:Mutation = {
        type            : "mutation",
        id              : defineData.baseMutID,
        name            : `${charName}的基础变异`,
        description     : `${charName}的基础变异`,
        points          : 0,
        integrated_armor: [defineData.baseArmorID],
        enchantments:[
            ...[...enchList,baseEnch].map(ench=>ench.id)
        ]
    }

    //dm.addCharEvent(charName,"CharUpdate",giveWeapon);
    outData['equip'] = [baseMut,baseArmor,baseEnch];
}