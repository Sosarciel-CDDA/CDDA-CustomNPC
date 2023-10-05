import { AmmunitionType, Ammo, Armor, BodyPartList, EnchArmorValType, EnchArmorValTypeList, EnchGenericValType, EnchGenericValTypeList, Enchantment, Eoc, Flag, Gun, ItemGroup, Mutation, NumObj, EnchModVal } from "CddaJsonFormat";
import { DataManager } from "./DataManager";
import { genEOCID, genEnchantmentID } from "./ModDefine";
import { EnchStat, getFieldVarID, parseEnchStatTable } from "./CharConfig";
import { JObject } from "@zwa73/utils";





/**创建角色装备 */
export async function createCharEquip(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);
    const TransparentItem = "CNPC_GENERIC_TransparentItem";
    /**基础变异 */
    const baseMut:Mutation = {
        type            : "mutation",
        id              : defineData.baseMutID,
        name            : `${charName}的基础变异`,
        description     : `${charName}的基础变异`,
        points          : 0,
        integrated_armor: [defineData.baseArmorID]
    }

    /**构造附魔属性 */
    /**基础附魔 */
    const baseEnch:Enchantment={
        id:defineData.baseEnchID,
        type:"enchantment",
        has:"WORN",
        condition:"ALWAYS",
        values:parseEnchStatTable(charConfig.ench_status)
    }

    //字段附魔
    const enchList:Enchantment[] = [baseEnch];
    for(const upgObj of charConfig.upgrade||[]){
        const fieldID = getFieldVarID(charName,upgObj.field);
        /**字段基础附魔 */
        const fdBaseEnch:Enchantment={
            id:genEnchantmentID(`${fieldID}_base`),
            type:"enchantment",
            has:"WORN",
            condition:"ALWAYS",
            values:parseEnchStatTable(upgObj.ench_status)
                .map(item=>{
                    const {value,add,multiply} = item;
                    let out:EnchModVal = {value};
                    if(add) out.add = {math:[`min(1,${fieldID})*${add}`]}
                    if(multiply) out.multiply = {math:[`min(1,${fieldID})*${multiply}`]}
                    return out;
                })
        }
        /**字段等级附魔 */
        const fdLvlEnch:Enchantment={
            id:genEnchantmentID(`${fieldID}_lvl`),
            type:"enchantment",
            has:"WORN",
            condition:"ALWAYS",
            values:parseEnchStatTable(upgObj.lvl_ench_status)
                .map(item=>{
                    const {value,add,multiply} = item;
                    let out:EnchModVal = {value};
                    if(add) out.add = {math:[`${fieldID}*${add}`]}
                    if(multiply) out.multiply = {math:[`${fieldID}*${multiply}`]}
                    return out;
                })
        }
        enchList.push(fdBaseEnch,fdLvlEnch);
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
        ?[{
            rigid: true,
            pocket_type: "CONTAINER",
            max_contains_volume: "100 L",
            max_contains_weight: "100 kg",
            moves: 1,
            fire_protection: true,
            max_item_length: "1 km",
            weight_multiplier: 0,
            volume_multiplier: 0,
            item_restriction:[charConfig.weapon.id]
        }]
        :undefined),
        relic_data :{
            passive_effects:[
                {id:genEnchantmentID('StatusMap')       },
                {id:genEnchantmentID('StatMod')         },
                ...enchList.map(ench=>({id:ench.id}))
            ]
        }
    }
    /**基础武器 */
    const baseWeapon = charConfig.weapon;
    const baseWeaponData:JObject[] = [];
    if(baseWeapon){
        baseWeapon.looks_like = baseWeapon.looks_like||TransparentItem;
        baseWeapon.flags = baseWeapon.flags||[];
        baseWeapon.flags?.push(
        defineData.baseWeaponFlagID,//角色武器标识
        "ACTIVATE_ON_PLACE"      ,//自动销毁
        "TRADER_KEEP"            ,//不会出售
        "UNBREAKABLE"            ,//不会损坏
        );
        if(baseWeapon.type=="GUN"){
            baseWeapon.flags?.push(
                "NEEDS_NO_LUBE" ,//不需要润滑油
                "NEVER_JAMS"    ,//不会故障
                "NON_FOULING"   ,//枪不会变脏或被黑火药污染。
            )
        }
        baseWeapon.countdown_interval= 1; //自动销毁


        /**基础武器物品组 */
        const baseItemGroup:ItemGroup={
            type:"item_group",
            id:defineData.baseWeaponGroupID,
            subtype:"collection",
            items:[baseWeapon.id],
        }
        /**基础武器的识别flag */
        const baseWeaponFlag:Flag={
            type:"json_flag",
            id:defineData.baseWeaponFlagID,
        }
        /**如果没武器则给予 */
        const giveWeapon:Eoc={
            type:"effect_on_condition",
            eoc_type:"ACTIVATION",
            id:genEOCID("GiveWeapon"),
            condition:{not:{ u_has_item: baseWeapon.id }},
            effect:[
                {u_spawn_item:baseWeapon.id}
            ]
        }
        dm.addCharEvent(charName,"CharUpdate",0,giveWeapon);
        baseWeaponData.push(giveWeapon,baseWeaponFlag,baseItemGroup,baseWeapon);
    }

    /**丢掉其他武器 */
    const dropOtherWeapon:Eoc={
        type:"effect_on_condition",
        id:genEOCID("DropOtherWeapon"),
        condition:{and:[
            "u_can_drop_weapon",
            {not:{u_has_wielded_with_flag: defineData.baseWeaponFlagID}}
        ]},
        effect:[
            "drop_weapon"
        ],
        eoc_type:"ACTIVATION",
    }
    dm.addCharEvent(charName,"CharUpdate",0,dropOtherWeapon);

    //dm.addCharEvent(charName,"CharUpdate",giveWeapon);
    outData['equip'] = [baseMut,baseArmor,dropOtherWeapon,...baseWeaponData,...enchList];
}