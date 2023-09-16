import { AmmiunitionType, Ammo, Armor, BodyPartList, Eoc, Flag, Gun, ItemGroup, Mutation } from "CddaJsonFormat";
import { DataManager } from "./DataManager";
import { genEOCID } from "./ModDefine";


export function createCharEquip(dm:DataManager,charName:string){
    const {baseData,outData} = dm.getCharData(charName);
    const TransparentItem = "CNPC_GENERIC_TransparentItem";
    /**基础变异 */
    const baseMut:Mutation = {
        type            : "mutation",
        id              : baseData.baseMutID,
        name            : `${charName}的基础变异`,
        description     : `${charName}的基础变异`,
        points          : 0,
        restricts_gear  : [...BodyPartList],
        remove_rigid    : [...BodyPartList],
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
        }]
    }
    /**基础武器 */
    const baseWeapon:Gun={
        type:"GUN",
        id:baseData.baseWeaponID,
        name:`${charName}的武器`,
        description:`${charName}的武器`,
        ammo:[baseData.baseAmmoTypeID],
        relic_data: {
            charge_info: {
                recharge_type: "periodic",
                time: 1,
                regenerate_ammo: true
            }
        },
        ammo_to_fire:0,
        pocket_data: [{
            pocket_type: "MAGAZINE",
            ammo_restriction: { [baseData.baseAmmoTypeID]: 10 }
        }],
        skill:"rifle",
        weight:0,
        volume:0,
        symbol:"O",
        looks_like:TransparentItem,
        flags:["ZERO_WEIGHT","ACTIVATE_ON_PLACE", "NO_RELOAD", "NO_UNLOAD",
            "NEVER_JAMS", "NON_FOULING","NEEDS_NO_LUBE", "TRADER_KEEP",
            baseData.baseWeaponFlagID],
        countdown_interval: 1,
        range:30,
        ranged_damage:{
            damage_type:"bullet",
            amount:50,
            armor_penetration:10,
        },
        melee_damage:{
            cut:20
        },
        modes:[["MELEE","近战",6],["DEFAULT","默认",2],["AUTO","全自动",4]]
    }
    /**基础弹药类型 */
    const baseAmmoType:AmmiunitionType={
        type:"ammunition_type",
        name:`${charName}的子弹类型`,
        id:baseData.baseAmmoTypeID,
        default:baseData.baseAmmoID,
    }
    /**基础武器所用的弹药 */
    const baseAmmo:Ammo={
        type:"AMMO",
        ammo_type:baseData.baseAmmoTypeID,
        id:baseData.baseAmmoID,
        name:`${charName}的子弹`,
        description:`${charName}的子弹`,
        weight:0,
        volume:0,
        symbol:"O",
        flags:["ZERO_WEIGHT"],
    }
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
    outData['equip'] = [baseMut,baseArmor,baseWeapon,baseAmmoType,baseAmmo,baseItemGroup,dropOtherWeapon,giveWeapon,baseWeaponFlag];
}