import { Armor, Enchantment, Eoc, Flag, Gun, ItemGroup, Mutation, NumObj, EnchModVal, BodyPartList, AnyItemID, PocketData, EocEffect } from "cdda-schema";
import { DataManager } from "../DataManager";
import { genActEoc, genEOCID, genEnchantmentID } from "ModDefine";
import { getTalkerFieldVarID, parseEnchStatTable } from "./CharConfig";
import { JObject } from "@zwa73/utils";
import { NO_PAIN_ENCHID } from "StaticData";





/**创建角色装备 */
export async function createCharEquip(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);

    const outs:JObject[]=[];

    const displayName = charName.replaceAll("_"," ");

    /**基础物品的识别flag */
    const baseItemFlag:Flag={
        type:"json_flag",
        id:defineData.baseItemFlagID,
    }

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
            dm.addSharedRes(fdBaseEnch.id,fdBaseEnch,"common_resource","common_ench");
            enchList.push(fdBaseEnch);
        }
        if(parseEnchStatTable(upgObj.lvl_ench_status).length>0){
            dm.addSharedRes(fdLvlEnch.id,fdLvlEnch,"common_resource","common_ench");
            enchList.push(fdLvlEnch);
        }
    }

    //背包约束
    let itemres = charConfig.carry?.map(carry=>
        typeof carry.item == "string"? carry.item : undefined)
        .filter(carry=>carry!=undefined) as AnyItemID[]|undefined;
    if(itemres && itemres.length<=0) itemres = undefined;
    const basePocket = {
        rigid: true,
        pocket_type: "CONTAINER",
        max_contains_volume: "100 L",
        max_contains_weight: "100 kg",
        moves: 1,
        fire_protection: true,
        max_item_length: "1 km",
        weight_multiplier: 0,
        volume_multiplier: 0,
    } as const;
    const pocketList:PocketData[] = [{
        ...basePocket,
        flag_restriction:[defineData.baseItemFlagID],
    }];
    if(itemres) pocketList.push({
        ...basePocket,
        item_restriction:itemres,
    })

    /**基础装备 */
    const baseArmor:Armor={
        type        : "ARMOR",
        id          : defineData.baseArmorID,
        name        : `${displayName}的基础装备`,
        description : `${displayName}的基础装备`,
        category    : "clothing",
        weight      : 0,
        volume      : 0,
        symbol      : "O",
        flags       : [
            "PERSONAL"              , //个人层
            "UNBREAKABLE"           , //不会损坏
            "INTEGRATED"            , //自体护甲
            "ZERO_WEIGHT"           , //无重量体积
            "TARDIS"                , //不会出售
            "PARTIAL_DEAF"          , //降低音量到安全水平
            "NO_SALVAGE"            , //无法拆分
            "ALLOWS_NATURAL_ATTACKS", //不会妨碍特殊攻击
            "PADDED"                , //有内衬 即使没有任何特定材料是柔软的, 这种盔甲也算舒适。
            defineData.baseItemFlagID
        ],
        pocket_data : pocketList,
        relic_data:{
            passive_effects:[
                ...[...enchList,baseEnch].map(ench=>({id:ench.id})),
                {id:NO_PAIN_ENCHID}
            ]
        }
    }

    /**基础变异 */
    const baseMut:Mutation = {
        type            : "mutation",
        id              : defineData.baseMutID,
        name            : `${displayName}的基础变异`,
        description     : `${displayName}的基础变异`,
        points          : 0,
        integrated_armor: [defineData.baseArmorID],
        valid:false,
        purifiable:false,
        player_display:false,
    }

    /**基础变量 */
    if(charConfig.base_var){
        const initBaseVarEoc=genActEoc(`${charName}_InitBaseVar`,[
            ...Object.entries(charConfig.base_var).map(entry=>{
                const eff:EocEffect = {math:[entry[0],"=",entry[1]+""]}
                return eff;
            })
        ])
        dm.addCharEvent(charName,"Init",0,initBaseVarEoc);
        outs.push(initBaseVarEoc);
    }

    //dm.addCharEvent(charName,"CharUpdate",giveWeapon);
    outData['equip'] = [baseMut,baseArmor,baseEnch,baseItemFlag,...outs];
}