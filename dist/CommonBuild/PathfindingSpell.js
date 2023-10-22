"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPathfindingSpell = void 0;
const MissionDefinition_1 = require("../CddaJsonFormat/MissionDefinition");
const OMNameIDMap = {
    //"lab_stairs":"科学实验室"
    "科学实验室": { om_special: "Lab", om_terrain: "lab_stairs" },
    "军事基地": { om_special: "mil_base", om_terrain: "road_end_north" },
    "中央实验室": { om_special: "Central Lab", om_terrain: "central_lab_entrance" },
    "冷冻实验室": { om_special: "Ice Lab", om_terrain: "ice_lab_stairs" },
    "避难所": { om_special: "Necropolis", om_terrain: "necropolis_a_1_north" },
    "科研大楼": { om_special: "lab_surface_big", om_terrain: "lab_surface_brick_basementA0_north" },
    "HUB 01": { om_special: "hub_01", om_terrain: "robofachq_roof_a0_north" },
    "难民中心": { om_special: "evac_center", om_terrain: "refctr_NW1a_north" },
    "黑龙沼泽": { om_special: "black_dragon_lair", om_terrain: "black_dragon_lair_z-0_NW_north" },
    "恶魔蜘蛛巢穴": { om_special: "demon_spider_lair", om_terrain: "demon_spider_lair_north" },
    "奇迹熔炉": { om_special: "forge_of_wonders", om_terrain: "forge_1A_north" },
    "跨洋物流": { om_special: "lab_mutagen_6_level", om_terrain: "full_basic_lab_roof_north" },
};
function createPathfindingSpell(dm) {
    const out = [];
    const id = "PathfindingSpell";
    const maineoc = {
        id: `${id}_eoc`,
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        effect: []
    };
    out.push(maineoc);
    const sp = {
        type: "SPELL",
        id: id,
        effect: "effect_on_condition",
        effect_str: maineoc.id,
        name: "寻路术",
        description: "寻找一个选定的目标地点",
        shape: "blast",
        valid_targets: ["self"],
    };
    out.push(sp);
    const subeocIdList = [];
    const nameList = [];
    for (const omname in OMNameIDMap) {
        const { om_special, om_terrain } = OMNameIDMap[omname];
        const miss = {
            type: "mission_definition",
            name: `寻路术 ${omname}`,
            difficulty: 0,
            value: 0,
            description: `寻路术帮你标记了一个未知的 ${omname}`,
            id: `${id}_mission_${om_special}`,
            goal: "MGOAL_GO_TO",
            dialogue: MissionDefinition_1.EmptyMissionDialog,
            origins: ["ORIGIN_ANY_NPC"],
            invisible_on_complete: true,
            start: {
                assign_mission_target: {
                    om_special, om_terrain,
                    reveal_radius: 1,
                    cant_see: true,
                    search_range: 360,
                    z: 0
                }
            }
        };
        out.push(miss);
        const subeoc = {
            id: `${id}_eoc_${om_special}`,
            type: "effect_on_condition",
            eoc_type: "ACTIVATION",
            effect: [
                { assign_mission: miss.id },
                //{remove_active_mission:miss.id},
            ]
        };
        out.push(subeoc);
        subeocIdList.push(subeoc.id);
        nameList.push(omname);
    }
    maineoc.effect?.push({
        run_eoc_selector: subeocIdList,
        names: nameList,
        title: "选择你想要寻找的地点"
    });
    dm.addStaticData(out, "common_resource", "PathfindingSpell");
}
exports.createPathfindingSpell = createPathfindingSpell;
