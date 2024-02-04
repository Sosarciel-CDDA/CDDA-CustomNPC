"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharEquip = void 0;
const CMDefine_1 = require("../CMDefine");
const CharInterface_1 = require("./CharInterface");
const StaticData_1 = require("../StaticData");
const UtilGener_1 = require("./UtilGener");
const CharData_1 = require("./CharData");
/**创建角色装备 */
async function createCharEquip(dm, charName) {
    const charConfig = await (0, CharData_1.getCharConfig)(charName);
    const outs = [];
    const displayName = charName.replaceAll("_", " ");
    /**基础物品的识别flag */
    const baseItemFlag = {
        type: "json_flag",
        id: (0, UtilGener_1.getCharBaseItemFlagId)(charName),
    };
    /**构造附魔属性 */
    /**基础附魔 */
    const baseEnch = {
        id: (0, UtilGener_1.getCharBaseEnchId)(charName),
        type: "enchantment",
        condition: "ALWAYS",
        values: (0, CharInterface_1.parseEnchStatTable)(charConfig.ench_status)
    };
    //字段附魔
    const enchList = [];
    for (const upgObj of charConfig.upgrade || []) {
        const field = upgObj.field;
        const ufield = (0, UtilGener_1.getTalkerFieldVarID)("u", field);
        /**字段基础附魔 */
        const fdBaseEnch = {
            id: CMDefine_1.CMDef.genEnchantmentID(`${field}_base`),
            type: "enchantment",
            condition: "ALWAYS",
            values: (0, CharInterface_1.parseEnchStatTable)(upgObj.ench_status)
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
            id: CMDefine_1.CMDef.genEnchantmentID(`${field}_lvl`),
            type: "enchantment",
            condition: "ALWAYS",
            values: (0, CharInterface_1.parseEnchStatTable)(upgObj.lvl_ench_status)
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
        if ((0, CharInterface_1.parseEnchStatTable)(upgObj.ench_status).length > 0) {
            dm.addSharedRes(fdBaseEnch.id, fdBaseEnch, "common_resource", "common_ench");
            enchList.push(fdBaseEnch);
        }
        if ((0, CharInterface_1.parseEnchStatTable)(upgObj.lvl_ench_status).length > 0) {
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
            flag_restriction: [(0, UtilGener_1.getCharBaseItemFlagId)(charName)],
        }];
    if (itemres)
        pocketList.push({
            ...basePocket,
            item_restriction: itemres,
        });
    /**基础装备 */
    const baseArmor = {
        type: "ARMOR",
        id: (0, UtilGener_1.getCharBaseArmorId)(charName),
        name: `${displayName}的基础装备`,
        description: `${displayName}的基础装备`,
        category: "clothing",
        weight: 0,
        volume: 0,
        symbol: "O",
        flags: [
            "PERSONAL", //个人层
            "UNBREAKABLE", //不会损坏
            "INTEGRATED", //自体护甲
            "ZERO_WEIGHT", //无重量体积
            "TARDIS", //不会出售
            "PARTIAL_DEAF", //降低音量到安全水平
            "NO_SALVAGE", //无法拆分
            "ALLOWS_NATURAL_ATTACKS", //不会妨碍特殊攻击
            "PADDED", //有内衬 即使没有任何特定材料是柔软的, 这种盔甲也算舒适。
            (0, UtilGener_1.getCharBaseItemFlagId)(charName)
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
        id: (0, UtilGener_1.getCharMutId)(charName),
        name: `${displayName}的基础变异`,
        description: `${displayName}的基础变异`,
        points: 0,
        integrated_armor: [(0, UtilGener_1.getCharBaseArmorId)(charName)],
        valid: false,
        purifiable: false,
        player_display: false,
    };
    /**基础变量 */
    if (charConfig.base_var) {
        const initBaseVarEoc = CMDefine_1.CMDef.genActEoc(`${charName}_InitBaseVar`, [
            ...Object.entries(charConfig.base_var).map(entry => {
                const eff = { math: [entry[0], "=", entry[1] + ""] };
                return eff;
            })
        ]);
        dm.addCharInvokeEoc(charName, "Init", 0, initBaseVarEoc);
        outs.push(initBaseVarEoc);
    }
    //dm.addCharEvent(charName,"CharUpdate",giveWeapon);
    dm.addCharStaticData(charName, [baseMut, baseArmor, baseEnch, baseItemFlag, ...outs], 'equip');
}
exports.createCharEquip = createCharEquip;
