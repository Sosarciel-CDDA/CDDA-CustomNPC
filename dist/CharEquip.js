"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharEquip = void 0;
const ModDefine_1 = require("./ModDefine");
const CharTalkTopic_1 = require("./CharTalkTopic");
/**创建角色装备 */
async function createCharEquip(dm, charName) {
    const { defineData, outData, charConfig } = await dm.getCharData(charName);
    const TransparentItem = "CNPC_GENERIC_TransparentItem";
    /**基础变异 */
    const baseMut = {
        type: "mutation",
        id: defineData.baseMutID,
        name: `${charName}的基础变异`,
        description: `${charName}的基础变异`,
        points: 0,
        integrated_armor: [defineData.baseArmorID]
    };
    /**构造附魔属性 */
    const enchStatMap = {};
    for (const str in charConfig.ench_status)
        enchStatMap[str] = charConfig.ench_status[str];
    /**基础附魔 */
    const baseEnch = {
        id: defineData.baseEnchID,
        type: "enchantment",
        has: "WORN",
        condition: "ALWAYS",
        values: Object.entries(enchStatMap).map(entry => ({
            value: entry[0],
            add: { math: [`${entry[1]}`] },
        }))
    };
    //字段附魔
    const enchList = [baseEnch];
    for (const upgObj of charConfig.upgrade || []) {
        const fieldID = (0, CharTalkTopic_1.getFieldVarID)(charName, upgObj.field);
        const enchStatMap = {};
        for (const str in upgObj.ench_status) {
            const stat = str;
            enchStatMap[stat] = enchStatMap[stat] || {};
            enchStatMap[stat].base = upgObj.ench_status[stat];
        }
        for (const str in upgObj.lvl_ench_status) {
            const stat = str;
            enchStatMap[stat] = enchStatMap[stat] || {};
            enchStatMap[stat].lvl = upgObj.lvl_ench_status[stat];
        }
        /**字段附魔 */
        const baseEnch = {
            id: (0, ModDefine_1.genEnchantmentID)(fieldID),
            type: "enchantment",
            has: "WORN",
            condition: "ALWAYS",
            values: Object.entries(enchStatMap).map(entry => ({
                value: entry[0],
                add: { math: [`(max(1,${fieldID})*${entry[1].base || 0})+(${fieldID}*${entry[1].lvl || 0})`] },
            }))
        };
        enchList.push(baseEnch);
    }
    /**基础装备 */
    const baseArmor = {
        type: "ARMOR",
        id: defineData.baseArmorID,
        name: `${charName}的基础装备`,
        description: `${charName}的基础装备`,
        category: "clothing",
        weight: 0,
        volume: 0,
        symbol: "O",
        flags: [
            "PERSONAL",
            "UNBREAKABLE",
            "INTEGRATED",
            "ZERO_WEIGHT",
            "TARDIS",
            "PARTIAL_DEAF", //降低音量到安全水平
        ],
        pocket_data: (charConfig.weapon
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
                    item_restriction: [charConfig.weapon.id]
                }]
            : undefined),
        relic_data: {
            passive_effects: [
                { id: (0, ModDefine_1.genEnchantmentID)('StatusMap') },
                { id: (0, ModDefine_1.genEnchantmentID)('StatMod') },
                ...enchList.map(ench => ({ id: ench.id }))
            ]
        }
    };
    /**基础武器 */
    const baseWeapon = charConfig.weapon;
    const baseWeaponData = [];
    if (baseWeapon) {
        baseWeapon.looks_like = baseWeapon.looks_like || TransparentItem;
        baseWeapon.flags = baseWeapon.flags || [];
        baseWeapon.flags?.push(defineData.baseWeaponFlagID, //角色武器标识
        "ACTIVATE_ON_PLACE", //自动销毁
        "TRADER_KEEP", //不会出售
        "UNBREAKABLE");
        if (baseWeapon.type == "GUN") {
            baseWeapon.flags?.push("NEEDS_NO_LUBE", //不需要润滑油
            "NEVER_JAMS", //不会故障
            "NON_FOULING");
        }
        baseWeapon.countdown_interval = 1; //自动销毁
        /**基础武器物品组 */
        const baseItemGroup = {
            type: "item_group",
            id: defineData.baseWeaponGroupID,
            subtype: "collection",
            items: [baseWeapon.id],
        };
        /**基础武器的识别flag */
        const baseWeaponFlag = {
            type: "json_flag",
            id: defineData.baseWeaponFlagID,
        };
        /**如果没武器则给予 */
        const giveWeapon = {
            type: "effect_on_condition",
            eoc_type: "ACTIVATION",
            id: (0, ModDefine_1.genEOCID)("GiveWeapon"),
            condition: { not: { u_has_item: baseWeapon.id } },
            effect: [
                { u_spawn_item: baseWeapon.id }
            ]
        };
        dm.addCharEvent(charName, "CharUpdate", 0, giveWeapon);
        baseWeaponData.push(giveWeapon, baseWeaponFlag, baseItemGroup, baseWeapon);
    }
    /**丢掉其他武器 */
    const dropOtherWeapon = {
        type: "effect_on_condition",
        id: (0, ModDefine_1.genEOCID)("DropOtherWeapon"),
        condition: { and: [
                "u_can_drop_weapon",
                { not: { u_has_wielded_with_flag: defineData.baseWeaponFlagID } }
            ] },
        effect: [
            "drop_weapon"
        ],
        eoc_type: "ACTIVATION",
    };
    dm.addCharEvent(charName, "CharUpdate", 0, dropOtherWeapon);
    //dm.addCharEvent(charName,"CharUpdate",giveWeapon);
    outData['equip'] = [baseMut, baseArmor, dropOtherWeapon, ...baseWeaponData, ...enchList];
}
exports.createCharEquip = createCharEquip;
