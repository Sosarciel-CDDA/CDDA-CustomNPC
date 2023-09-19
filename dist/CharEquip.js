"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharEquip = void 0;
const CddaJsonFormat_1 = require("./CddaJsonFormat");
const ModDefine_1 = require("./ModDefine");
async function createCharEquip(dm, charName) {
    const { baseData, outData, charConfig } = await dm.getCharData(charName);
    const TransparentItem = "CNPC_GENERIC_TransparentItem";
    /**基础变异 */
    const baseMut = {
        type: "mutation",
        id: baseData.baseMutID,
        name: `${charName}的基础变异`,
        description: `${charName}的基础变异`,
        points: 0,
        restricts_gear: [...CddaJsonFormat_1.BodyPartList],
        remove_rigid: [...CddaJsonFormat_1.BodyPartList],
        integrated_armor: [baseData.baseArmorID]
    };
    /**基础装备 */
    const baseArmor = {
        type: "ARMOR",
        id: baseData.baseArmorID,
        name: `${charName}的基础装备`,
        description: `${charName}的基础装备`,
        category: "clothing",
        weight: 0,
        volume: 0,
        symbol: "O",
        flags: ["PERSONAL", "UNBREAKABLE", "INTEGRATED", "ZERO_WEIGHT", "TARDIS"],
        pocket_data: [{
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
        relic_data: {
            passive_effects: [
                { id: (0, ModDefine_1.genEnchantmentID)('StatusMap') },
                { id: (0, ModDefine_1.genEnchantmentID)('PerRangeDamage') },
            ]
        }
    };
    /**基础武器 */
    const baseWeapon = charConfig.weapon;
    baseWeapon.looks_like = baseWeapon.looks_like || TransparentItem;
    baseWeapon.flags = baseWeapon.flags || [];
    baseWeapon.flags?.push(baseData.baseWeaponFlagID, //绝色武器标识
    "ACTIVATE_ON_PLACE", //自动销毁
    "TRADER_KEEP");
    baseWeapon.countdown_interval = 1; //自动销毁
    /**基础武器物品组 */
    const baseItemGroup = {
        type: "item_group",
        id: baseData.baseWeaponGroupID,
        subtype: "collection",
        items: [baseData.baseWeaponID],
    };
    /**基础武器的识别flag */
    const baseWeaponFlag = {
        type: "json_flag",
        id: baseData.baseWeaponFlagID,
    };
    /**丢掉其他武器 */
    const dropOtherWeapon = {
        type: "effect_on_condition",
        id: (0, ModDefine_1.genEOCID)("DropOtherWeapon"),
        condition: { and: [
                "u_can_drop_weapon",
                { not: { u_has_wielded_with_flag: baseData.baseWeaponFlagID } }
            ] },
        effect: [
            "drop_weapon"
        ],
        eoc_type: "ACTIVATION",
    };
    /**如果没武器则给予 */
    const giveWeapon = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)("GiveWeapon"),
        condition: { not: { u_has_item: baseData.baseWeaponID } },
        effect: [
            { u_spawn_item: baseData.baseWeaponID }
        ]
    };
    dm.addCharEvent(charName, "CharUpdate", dropOtherWeapon, giveWeapon);
    //dm.addCharEvent(charName,"CharUpdate",giveWeapon);
    outData['equip'] = [baseMut, baseArmor, baseWeapon, baseItemGroup, dropOtherWeapon, giveWeapon, baseWeaponFlag];
}
exports.createCharEquip = createCharEquip;
