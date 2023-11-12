"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDetonateTearSpell = void 0;
const ModDefine_1 = require("../ModDefine");
const commonGroups = [
    "afs_common_biomaterial_scrapgroup",
    "afs_common_circuitry_scrapgroup",
    "afs_common_energy_storage_scrapgroup",
    "afs_common_heat_scrapgroup",
    "afs_common_magnet_scrapgroup",
    "afs_common_material_scrapgroup",
    "afs_common_neural_io_scrapgroup",
];
const advanceGroups = [
    "afs_advanced_biomaterial_scrapgroup",
    "afs_advanced_circuitry_scrapgroup",
    "afs_advanced_energy_storage_scrapgroup",
    "afs_advanced_heat_scrapgroup",
    "afs_advanced_magnet_scrapgroup",
    "afs_advanced_material_scrapgroup",
    "afs_advanced_neural_io_scrapgroup",
    "afs_advanced_optics_scrapgroup",
];
const itemcollect = [
    ["afs_biomaterial_1", 100],
    ["afs_biomaterial_2", 95],
    ["afs_biomaterial_3", 90],
    ["afs_biomaterial_4", 85],
    ["afs_biomaterial_5", 80],
    ["afs_circuitry_1", 100],
    ["afs_circuitry_2", 95],
    ["afs_circuitry_3", 90],
    ["afs_circuitry_4", 85],
    ["afs_circuitry_5", 80],
    ["afs_energy_storage_1", 100],
    ["afs_energy_storage_2", 95],
    ["afs_energy_storage_3", 90],
    ["afs_energy_storage_4", 85],
    ["afs_energy_storage_5", 80],
    ["afs_heat_1", 100],
    ["afs_heat_2_salvage", 95],
    ["afs_heat_3", 90],
    ["afs_heat_4", 85],
    ["afs_heat_5", 80],
    ["afs_magnet_1", 100],
    ["afs_magnet_2", 95],
    ["afs_magnet_3", 90],
    ["afs_magnet_4", 85],
    ["afs_material_1", 100],
    ["afs_material_2", 95],
    ["afs_material_3", 90],
    ["afs_material_4", 85],
    ["afs_material_5", 80],
    ["afs_neural_io_1", 100],
    ["afs_neural_io_2", 95],
    ["afs_neural_io_3", 90],
    ["afs_neural_io_4", 85],
    ["afs_neural_io_5", 80],
    ["afs_optics_3", 90],
    ["afs_optics_4", 85],
];
async function createDetonateTearSpell(dm) {
    const id = `DetonateTearSpell`;
    const cdvar = `${id}_cooldown`;
    const out = [];
    const charDataList = await Promise.all(dm.charList.map(charName => {
        return dm.getCharData(charName);
    }));
    //卡片集
    const cardGroup = {
        id: (0, ModDefine_1.genItemGroupID)(`CardDistribution`),
        type: "item_group",
        subtype: "distribution",
        entries: charDataList.map(cd => ({
            item: cd.defineData.cardID,
            prob: 1
        }))
    };
    out.push(cardGroup);
    //物品集
    const mateGroup = {
        id: (0, ModDefine_1.genItemGroupID)(`AfsMateDistribution`),
        type: "item_group",
        subtype: "distribution",
        items: itemcollect
    };
    out.push(mateGroup);
    //主物品组
    const mainGroup = {
        type: "item_group",
        id: `${id}_ItemGroup`,
        subtype: "collection",
        entries: [
            { group: cardGroup.id, prob: 100 },
            { group: mateGroup.id, count: [10, 15] },
            { group: "bionics", prob: 100, count: [3, 6] },
        ]
    };
    out.push(mainGroup);
    //爆炸效果
    const expl = {
        type: "SPELL",
        id: `${id}_explosion`,
        min_aoe: 5,
        effect: "attack",
        field_id: "fd_tindalos_rift",
        min_damage: 10,
        max_damage: 20,
        damage_type: "pure",
        field_chance: 8,
        min_field_intensity: 2,
        max_field_intensity: 2,
        field_intensity_variance: 1,
        shape: "blast",
        valid_targets: ["ally", "self", "ground", "hostile"],
        name: "引爆裂隙爆炸效果2",
        description: "引爆裂隙爆炸效果2",
        flags: ["RANDOM_DAMAGE"]
    };
    out.push(expl);
    //关闭裂隙
    const closeSpell = {
        type: "SPELL",
        id: `${id}_close_tear`,
        name: "引爆裂隙关闭效果",
        description: "引爆裂隙关闭效果",
        valid_targets: ["ground"],
        shape: "blast",
        effect: "remove_field",
        effect_str: "fd_fatigue",
        min_aoe: 0,
        max_aoe: 0,
        flags: ["IGNORE_WALLS", "NO_PROJECTILE", "NO_EXPLOSION_SFX"],
    };
    out.push(closeSpell);
    //主EOC
    const maineoc = {
        type: "effect_on_condition",
        id: `${id}_eoc`,
        eoc_type: "ACTIVATION",
        effect: [
            { u_add_var: cdvar, time: true },
            { u_cast_spell: { id: closeSpell.id } },
            { u_cast_spell: { id: expl.id } },
            { u_spawn_item: mainGroup.id, use_item_group: true, suppress_message: true },
        ],
        condition: { and: [
                { u_is_in_field: "fd_fatigue" },
                { or: [
                        { u_compare_time_since_var: cdvar, op: ">=", time: "10 s" },
                        { not: { u_has_var: cdvar, time: true } }
                    ] }
            ] },
        false_effect: [
            { u_add_var: cdvar, time: true },
            { u_message: "没有什么效果……" }
        ]
    };
    out.push(maineoc);
    //主法术
    const mainSpell = {
        type: "SPELL",
        id: id,
        name: "引爆裂隙",
        description: "引爆脚下的时空裂隙, 可以获得被裂隙卷入的随机物品。",
        shape: "blast",
        effect: "effect_on_condition",
        effect_str: maineoc.id,
        valid_targets: ["self"]
    };
    out.push(mainSpell);
    dm.addStaticData(out, "common_resource", "DetonateTearSpell");
}
exports.createDetonateTearSpell = createDetonateTearSpell;
