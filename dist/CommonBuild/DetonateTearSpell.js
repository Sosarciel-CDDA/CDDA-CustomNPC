"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDetonateTearSpell = void 0;
const ModDefine_1 = require("../ModDefine");
const StaticData_1 = require("../StaticData");
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
    ["afs_biomaterial_2", 70],
    ["afs_biomaterial_3", 50],
    ["afs_biomaterial_4", 35],
    ["afs_biomaterial_5", 24],
    ["afs_circuitry_1", 100],
    ["afs_circuitry_2", 70],
    ["afs_circuitry_3", 50],
    ["afs_circuitry_4", 35],
    ["afs_circuitry_5", 24],
    ["afs_energy_storage_1", 100],
    ["afs_energy_storage_2", 70],
    ["afs_energy_storage_3", 50],
    ["afs_energy_storage_4", 35],
    ["afs_energy_storage_5", 24],
    ["afs_heat_1", 100],
    ["afs_heat_2_salvage", 70],
    ["afs_heat_3", 50],
    ["afs_heat_4", 35],
    ["afs_heat_5", 24],
    ["afs_magnet_1", 100],
    ["afs_magnet_2", 70],
    ["afs_magnet_3", 50],
    ["afs_magnet_4", 35],
    ["afs_material_1", 100],
    ["afs_material_2", 70],
    ["afs_material_3", 50],
    ["afs_material_4", 35],
    ["afs_material_5", 24],
    ["afs_neural_io_1", 100],
    ["afs_neural_io_2", 70],
    ["afs_neural_io_3", 50],
    ["afs_neural_io_4", 35],
    ["afs_neural_io_5", 24],
    ["afs_optics_3", 50],
    ["afs_optics_4", 35],
];
async function createDetonateTearSpell(dm) {
    const id = `DetonateTearSpell`;
    const cdvar = `${id}_cooldown`;
    const out = [];
    const charDataList = await Promise.all(dm.charList.map(charName => {
        return dm.getCharData(charName);
    }));
    //爆炸效果
    const expl2 = {
        type: "SPELL",
        id: `${id}_explosion2`,
        min_aoe: 5,
        effect: "attack",
        field_id: "fd_tindalos_rift",
        min_damage: 80,
        max_damage: 160,
        damage_type: "pure",
        field_chance: 4,
        min_field_intensity: 2,
        max_field_intensity: 2,
        field_intensity_variance: 1,
        shape: "blast",
        valid_targets: ["ally", "self", "ground", "hostile"],
        name: "引爆裂隙爆炸效果2",
        description: "引爆裂隙爆炸效果2",
        flags: ["RANDOM_DAMAGE"]
    };
    out.push(expl2);
    //主EOC
    const maineoc = {
        type: "effect_on_condition",
        id: `${id}_eoc`,
        eoc_type: "ACTIVATION",
        effect: [
            { npc_add_var: cdvar, time: true },
            { npc_cast_spell: { id: "AO_CLOSE_TEAR" } },
            { u_cast_spell: { id: expl2.id } },
            { math: ["u_hp()", "=", "0"] },
        ],
        condition: { and: [
                { u_is_in_field: "fd_fatigue" },
                { or: [
                        { npc_compare_time_since_var: cdvar, op: ">=", time: "1 h" },
                        { not: { npc_has_var: cdvar, time: true } }
                    ] }
            ] },
        false_effect: [
            { npc_add_var: cdvar, time: true },
            { npc_message: "没有什么效果……" },
            { u_location_variable: { global_val: "tmp_loc" }, z_adjust: -10, z_override: true },
            { u_teleport: { global_val: "tmp_loc" }, force: true },
            { math: ["u_hp()", "=", "0"] },
        ]
    };
    out.push(maineoc);
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
    const metGroup = {
        id: (0, ModDefine_1.genItemGroupID)(`CardDistribution`),
        type: "item_group",
        subtype: "distribution",
        items: itemcollect
    };
    out.push(metGroup);
    //辅助检测怪物
    const mon = {
        type: "MONSTER",
        id: `${id}_mon`,
        name: "",
        description: "空间裂隙辅助检测怪物",
        looks_like: "CNPC_GENERIC_TransparentItem",
        speed: 500,
        hp: 1,
        default_faction: "passive_machine",
        symbol: "O",
        weight: 0,
        volume: 0,
        vision_day: 0,
        vision_night: 0,
        aggression: 0,
        morale: 1000,
        flags: ["NOHEAD", "NO_BREATHE", "NO_BREATHE"],
        death_function: {
            corpse_type: "NO_CORPSE",
            message: "",
        },
        death_drops: {
            subtype: "collection",
            entries: [
                { group: cardGroup.id, prob: 100 },
                { group: metGroup.id, count: 10 },
                { group: "bionics", prob: 100, count: [3, 6] },
            ]
        }
    };
    out.push(mon);
    //子效果
    const extspell = {
        type: "SPELL",
        id: `${id}_sub`,
        name: "引爆裂隙的eoc子效果",
        description: "引爆裂隙的eoc子效果",
        shape: "blast",
        min_range: 15,
        valid_targets: ["hostile", "ally"],
        targeted_monster_ids: [mon.id],
        effect: "effect_on_condition",
        effect_str: maineoc.id,
        flags: [...StaticData_1.CON_SPELL_FLAG, "IGNORE_WALLS"]
    };
    out.push(extspell);
    //主法术
    const mainSpell = {
        type: "SPELL",
        id: id,
        name: "引爆裂隙",
        description: "引爆一个时空裂隙, 可以获得被裂隙卷入的随机物品。",
        shape: "blast",
        min_range: 15,
        min_duration: 1,
        min_damage: 1,
        max_damage: 1,
        effect: "summon",
        effect_str: mon.id,
        valid_targets: ["ground"],
        extra_effects: [{ id: extspell.id }],
        flags: ["SPAWN_WITH_DEATH_DROPS"]
    };
    out.push(mainSpell);
    dm.addStaticData(out, "common_resource", "DetonateTearSpell");
}
exports.createDetonateTearSpell = createDetonateTearSpell;
