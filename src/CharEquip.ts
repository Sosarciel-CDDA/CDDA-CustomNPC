import { AmmiunitionType, Ammo, Armor, BodyPartList, EnchArmorValTypeList, EnchGenericValTypeList, Enchantment, Eoc, Flag, Gun, ItemGroup, Mutation } from "CddaJsonFormat";
import { DataManager } from "./DataManager";
import { genEOCID, genEnchantmentID } from "./ModDefine";


export async function createCharEquip(dm:DataManager,charName:string){
    const {baseData,outData,charConfig} = await dm.getCharData(charName);
    const TransparentItem = "CNPC_GENERIC_TransparentItem";
    /**基础变异 */
    const baseMut:Mutation = {
        type            : "mutation",
        id              : baseData.baseMutID,
        name            : `${charName}的基础变异`,
        description     : `${charName}的基础变异`,
        points          : 0,
        integrated_armor: [baseData.baseArmorID]
    }
    /**基础装备 */
    const baseArmor:Armor={
        type        : "ARMOR",
        id          : baseData.baseArmorID,
        name        : `${charName}的基础装备`,
        description : `${charName}的基础装备`,
        category    : "clothing",
        weight      : 0,
        volume      : 0,
        symbol      : "O",
        flags       : ["PERSONAL","UNBREAKABLE","INTEGRATED","ZERO_WEIGHT","TARDIS"],
        pocket_data : [{
            rigid: true,
            pocket_type: "CONTAINER",
            max_contains_volume: "100 L",
            max_contains_weight: "100 kg",
            moves: 1,
            fire_protection: true,
            max_item_length: "1 km",
            weight_multiplier: 0,
            volume_multiplier: 0,
        }],
        relic_data :{
            passive_effects:[
                {id:genEnchantmentID('StatusMap')       },
                {id:genEnchantmentID('StatMod')         },
            ]
        }
    }
    /**基础武器 */
    const baseWeapon = charConfig.weapon;
    baseWeapon.looks_like = baseWeapon.looks_like||TransparentItem;
    baseWeapon.flags = baseWeapon.flags||[];
    baseWeapon.flags?.push(
        baseData.baseWeaponFlagID,//绝色武器标识
        "ACTIVATE_ON_PLACE"      ,//自动销毁
        "TRADER_KEEP"            ,//不会出售
    );
    baseWeapon.countdown_interval= 1; //自动销毁

    /**基础武器物品组 */
    const baseItemGroup:ItemGroup={
        type:"item_group",
        id:baseData.baseWeaponGroupID,
        subtype:"collection",
        items:[baseData.baseWeaponID],
    }
    /**基础武器的识别flag */
    const baseWeaponFlag:Flag={
        type:"json_flag",
        id:baseData.baseWeaponFlagID,
    }
    /**丢掉其他武器 */
    const dropOtherWeapon:Eoc={
        type:"effect_on_condition",
        id:genEOCID("DropOtherWeapon"),
        condition:{and:[
            "u_can_drop_weapon",
            {not:{u_has_wielded_with_flag: baseData.baseWeaponFlagID}}
        ]},
        effect:[
            "drop_weapon"
        ],
        eoc_type:"ACTIVATION",
    }
    /**如果没武器则给予 */
    const giveWeapon:Eoc={
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:genEOCID("GiveWeapon"),
        condition:{not:{ u_has_item: baseData.baseWeaponID }},
        effect:[
            {u_spawn_item:baseData.baseWeaponID}
        ]
    }
    dm.addCharEvent(charName,"CharUpdate",dropOtherWeapon,giveWeapon);
    //dm.addCharEvent(charName,"CharUpdate",giveWeapon);
    outData['equip'] = [baseMut,baseArmor,baseWeapon,baseItemGroup,dropOtherWeapon,giveWeapon,baseWeaponFlag];
}