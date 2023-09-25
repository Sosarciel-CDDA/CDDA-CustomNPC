import { AmmunitionType, Ammo, Armor, BodyPartList, EnchArmorValType, EnchArmorValTypeList, EnchGenericValType, EnchGenericValTypeList, Enchantment, Eoc, Flag, Gun, ItemGroup, Mutation } from "CddaJsonFormat";
import { DataManager, EnchStat } from "./DataManager";
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

    /**构造附魔属性 */
    const enchStatMap:Partial<
        Record<EnchStat,
        {base?:number,lvl?:number}>> = {};
    for(const str in charConfig.ench_status){
        const stat = str as EnchStat;
        enchStatMap[stat] = enchStatMap[stat]||{};
        enchStatMap[stat]!.base=charConfig.ench_status[stat];
    }
    for(const str in charConfig.lvl_ench_status){
        const stat = str as EnchStat;
        enchStatMap[stat] = enchStatMap[stat]||{};
        enchStatMap[stat]!.lvl=charConfig.lvl_ench_status[stat];
    }
    /**基础附魔 */
    const baseEnch:Enchantment={
        id:baseData.baseEnchID,
        type:"enchantment",
        has:"WORN",
        condition:"ALWAYS",
        values:Object.entries(enchStatMap).map(entry=>({
            value   :entry[0] as EnchStat,
            add     :{math:[`${entry[1].base||0}+(u_cnpcLvl*${entry[1].lvl||0})`]},
        }))
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
        flags       : [
            "PERSONAL"      ,//个人层
            "UNBREAKABLE"   ,//不会损坏
            "INTEGRATED"    ,//自体护甲
            "ZERO_WEIGHT"   ,//无重量体积
            "TARDIS"        ,//不会出售
            "PARTIAL_DEAF"  ,//降低音量到安全水平
        ],
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
                {id:baseData.baseEnchID                 },
            ]
        }
    }
    /**基础武器 */
    const baseWeapon = charConfig.weapon;
    baseWeapon.looks_like = baseWeapon.looks_like||TransparentItem;
    baseWeapon.flags = baseWeapon.flags||[];
    baseWeapon.flags?.push(
        baseData.baseWeaponFlagID,//角色武器标识
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
    dm.addCharEvent(charName,"CharUpdate",0,dropOtherWeapon,giveWeapon);
    //dm.addCharEvent(charName,"CharUpdate",giveWeapon);
    outData['equip'] = [baseMut,baseArmor,baseEnch,baseWeapon,baseItemGroup,dropOtherWeapon,giveWeapon,baseWeaponFlag];
}