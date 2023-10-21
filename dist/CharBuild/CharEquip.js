"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharEquip = void 0;
const ModDefine_1 = require("../ModDefine");
const CharConfig_1 = require("./CharConfig");
const StaticData_1 = require("../StaticData");
/**创建角色装备 */
async function createCharEquip(dm, charName) {
    const { defineData, outData, charConfig } = await dm.getCharData(charName);
    const outs = [];
    /**基础物品的识别flag */
    const baseItemFlag = {
        type: "json_flag",
        id: defineData.baseItemFlagID,
    };
    /**构造附魔属性 */
    /**基础附魔 */
    const baseEnch = {
        id: defineData.baseEnchID,
        type: "enchantment",
        condition: "ALWAYS",
        values: (0, CharConfig_1.parseEnchStatTable)(charConfig.ench_status)
    };
    //字段附魔
    const enchList = [];
    for (const upgObj of charConfig.upgrade || []) {
        const field = upgObj.field;
        const ufield = (0, CharConfig_1.getTalkerFieldVarID)("u", field);
        /**字段基础附魔 */
        const fdBaseEnch = {
            id: (0, ModDefine_1.genEnchantmentID)(`${field}_base`),
            type: "enchantment",
            condition: "ALWAYS",
            values: (0, CharConfig_1.parseEnchStatTable)(upgObj.ench_status)
                .map(item => {
                const { value, add, multiply } = item;
                let out = { value };
                if (add)
                    out.add = { math: [`min(1,${ufield})*(${add.math[0]})`] };
                if (multiply)
                    out.multiply = { math: [`min(1,${ufield})*(${multiply.math[0]})`] };
                return out;
            })
        };
        /**字段等级附魔 */
        const fdLvlEnch = {
            id: (0, ModDefine_1.genEnchantmentID)(`${field}_lvl`),
            type: "enchantment",
            condition: "ALWAYS",
            values: (0, CharConfig_1.parseEnchStatTable)(upgObj.lvl_ench_status)
                .map(item => {
                const { value, add, multiply } = item;
                let out = { value };
                if (add)
                    out.add = { math: [`${ufield}*(${add.math[0]})`] };
                if (multiply)
                    out.multiply = { math: [`${ufield}*(${multiply.math[0]})`] };
                return out;
            })
        };
        if ((0, CharConfig_1.parseEnchStatTable)(upgObj.ench_status).length > 0) {
            dm.addSharedRes(fdBaseEnch.id, fdBaseEnch, "common_resource", "common_ench");
            enchList.push(fdBaseEnch);
        }
        if ((0, CharConfig_1.parseEnchStatTable)(upgObj.lvl_ench_status).length > 0) {
            dm.addSharedRes(fdLvlEnch.id, fdLvlEnch, "common_resource", "common_ench");
            enchList.push(fdLvlEnch);
        }
    }
    //背包约束
    let itemres = charConfig.carry?.map(carry => typeof carry.item == "string" ? carry.item : undefined)
        .filter(carry => carry != undefined);
    if (itemres && itemres.length <= 0)
        itemres = undefined;
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
    };
    const pocketList = [{
            ...basePocket,
            flag_restriction: [defineData.baseItemFlagID],
        }];
    if (itemres)
        pocketList.push({
            ...basePocket,
            item_restriction: itemres,
        });
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
            "PARTIAL_DEAF",
            "NO_SALVAGE",
            "ALLOWS_NATURAL_ATTACKS",
            "PADDED",
            defineData.baseItemFlagID
        ],
        pocket_data: pocketList,
        relic_data: {
            passive_effects: [
                ...[...enchList, baseEnch].map(ench => ({ id: ench.id })),
                { id: StaticData_1.NO_PAIN_ENCHID }
            ]
        }
    };
    /**基础变异 */
    const baseMut = {
        type: "mutation",
        id: defineData.baseMutID,
        name: `${charName}的基础变异`,
        description: `${charName}的基础变异`,
        points: 0,
        integrated_armor: [defineData.baseArmorID],
        valid: false,
        purifiable: false,
        player_display: false,
    };
    /**基础变量 */
    if (charConfig.base_var) {
        const initBaseVarEoc = (0, ModDefine_1.genActEoc)(`${charName}_InitBaseVar`, [
            ...Object.entries(charConfig.base_var).map(entry => {
                const eff = { math: [entry[0], "=", entry[1] + ""] };
                return eff;
            })
        ]);
        dm.addCharEvent(charName, "CnpcInit", 0, initBaseVarEoc);
        outs.push(initBaseVarEoc);
    }
    //dm.addCharEvent(charName,"CharUpdate",giveWeapon);
    outData['equip'] = [baseMut, baseArmor, baseEnch, baseItemFlag, ...outs];
}
exports.createCharEquip = createCharEquip;
