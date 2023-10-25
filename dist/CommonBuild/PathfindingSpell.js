"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPathfindingSpell = void 0;
const MissionDefinition_1 = require("../CddaJsonFormat/MissionDefinition");
const OMNameIDMap = {
    "蚁巢": { om_terrain: "anthill", om_special: "anthill" },
    "酸蚁巢": { om_terrain: "acid_anthill", om_special: undefined },
    "寄生蜂": { om_terrain: "nest_dermatik", om_special: "Large Dermatik Nest" },
    "蜂巢": { om_terrain: "hive", om_special: undefined },
    "巨型网蛛": { om_terrain: "forest", om_special: "mx_spider" },
    "蜘蛛巢穴": { om_terrain: "spider_pit", om_special: "Spider Pit" },
    "真菌花林": { om_terrain: "fungal_bloom", om_special: "Fungal Bloom" },
    "真菌塔": { om_terrain: "fungal_tower", om_special: "Fungal Tower" },
    "真菌花": { om_terrain: "fungal_flowers", om_special: "Fungal Flowers" },
    "米·戈营地": { om_terrain: "mi-go_camp1", om_special: "Mi-Go Encampment" },
    "米·戈侦察塔": { om_terrain: "mi-go_scout_tower_1", om_special: "Mi-Go Scout Tower" },
    "三尖树之林": { om_terrain: "triffid_grove", om_special: "Triffid Grove" },
    "海怪巢穴": { om_terrain: "river_cave", om_special: undefined },
    "变形怪坑": { om_terrain: "slimepit_top", om_special: "Slime Pit" },
    "异界实验室": { om_terrain: "microlab_portal_MSU14", om_special: undefined },
    "流亡族基地": { om_terrain: "exodii_base_x0y3z0", om_special: "exodii_base" },
    "神秘庙宇": { om_terrain: "temple_stairs", om_special: "Strangle Temple" },
    "河流": { om_terrain: "river_center", om_special: undefined },
    "粘土矿床": { om_terrain: "forest", om_special: "mx_clay_deposit" },
    "沙地": { om_terrain: "field", om_special: "mx_sand_patch" },
    "温泉": { om_terrain: "hot_springs", om_special: "Hot Springs" },
    "洞穴": { om_terrain: "cave", om_special: "Cave" },
    "军事基地": { om_terrain: "road_end", om_special: "mil_base" },
    "中央实验室": { om_terrain: "central_lab_finale", om_special: "Central Lab", global_unique: true },
    "科学实验室": { om_terrain: "lab_finale", om_special: "Lab" },
    "冷冻实验室": { om_terrain: "ice_lab_finale", om_special: "Ice Lab" },
    "实验室大楼": { om_terrain: "tower_lab_finale", om_special: undefined },
    "科研大楼": { om_terrain: "lab_surface_brick_blockA0", om_special: "lab_surface_big" },
    "坠毁客机": { om_terrain: "airliner_2b", om_special: undefined },
    "LMOE避难所": { om_terrain: "lmoe", om_special: undefined, om_terrain_match_type: "PREFIX" },
    "HUB 01": { om_terrain: "robofachq_roof_a0", om_special: "hub_01", global_unique: true },
    "难民中心": { om_terrain: "refctr_NW1a", om_special: "evac_center", global_unique: true },
    "跨洋物流": { om_terrain: "full_basic_lab_roof", om_special: "lab_mutagen_6_level" },
    "倒塌大楼": { om_terrain: "office_tower_collapse_a0", om_special: undefined },
    "怪物尸体": { om_terrain: "corpse_tentacle_surface_entry", om_special: "nether_monster_corpse" },
    "医院大楼": { om_terrain: "urban_35_7", om_special: undefined },
    "沉船": { om_terrain: "shipwreck_river_1", om_special: undefined },
    "医院": { om_terrain: "hospital_1", om_special: undefined },
    "木材厂": { om_terrain: "lumbermill_0_0_ocu", om_special: undefined },
    "购物中心": { om_terrain: "mall_a_1", om_special: undefined },
    "诊所": { om_terrain: "office_doctor_1", om_special: undefined },
    "辐照厂": { om_terrain: "irradiator_1_5", om_special: undefined },
    "市政核电站": { om_terrain: "municipal_reactor", om_special: undefined },
    "私人度假村": { om_terrain: "p_resort_pm", om_special: undefined },
    "教堂避难所": { om_terrain: "godco_1", om_special: undefined },
    "伊舍伍德农场": { om_terrain: "farm_isherwood_1", om_special: undefined },
    "码头": { om_terrain: "lake_dock_small", om_special: undefined },
    "墓地": { om_terrain: "cemetery_4square_00", om_special: undefined },
    "商会工坊": { om_terrain: "isolated_house_farm_gunsmith", om_special: undefined },
    "酿酒厂": { om_terrain: "farm_stills_7", om_special: "Farm Mutable" },
    "别墅": { om_terrain: "mansion", om_special: undefined, om_terrain_match_type: "PREFIX" },
    "大学": { om_terrain: "campus_admin_0_0_0", om_special: "campus" },
    "枪械展会": { om_terrain: "gunshow_0", om_special: "gun_show" },
    "安静的农场": { om_terrain: "unvitrified_farm_0", om_special: "quiet_farm", global_unique: true },
    "航母": { om_terrain: "aircraft_carrier_1a", om_special: "aircraft_carrier", global_unique: true },
    "逃兵前哨站": { om_terrain: "deserter_city_gate", om_special: "deserter_city", global_unique: true },
    "核电站": { om_terrain: "nuclear_plant_0_0_0", om_special: "nuclear power plant", global_unique: true },
    "避难所": { om_terrain: "necropolis_a_1", om_special: "Necropolis", mod_is_loaded: "no_hope" },
    "人体强化诊所": { om_terrain: "afs_augmentation_clinic_n1", om_special: undefined, mod_is_loaded: "aftershock" },
    "坠毁飞船": { om_terrain: "crashing_ship_3", om_special: "crashing ship", mod_is_loaded: "aftershock", global_unique: true },
    "生化先驱者苹果园": { om_terrain: "prepnet_orchard", om_special: "prepnet_orchard", mod_is_loaded: "aftershock", global_unique: true },
    "奇怪的LMOE避难所": { om_terrain: "whately_lmoe", om_special: "Strange LMOE Shelter", mod_is_loaded: "aftershock" },
    "调谐祭坛": { om_terrain: "attunement_altar_NW", om_special: "attunement altar", mod_is_loaded: "magiclysm" },
    "魔法草甸": { om_terrain: "magic_field_a1", om_special: "magic_field", mod_is_loaded: "magiclysm" },
    "古老石阵": { om_terrain: "standing_teleport_stones", om_special: "standing_teleport_stones", mod_is_loaded: "magiclysm" },
    "哥布林营地": { om_terrain: "goblin_1A", om_special: "goblin_encampment", mod_is_loaded: "magiclysm" },
    "兽人村落": { om_terrain: "orc_village", om_special: "orc_village", mod_is_loaded: "magiclysm" },
    "巴洛炎魔": { om_terrain: "mine_balrog_central", om_special: "Balrog mine", mod_is_loaded: "magiclysm" },
    "黑龙沼泽": { om_terrain: "black_dragon_lair_z-0_NW", om_special: "black_dragon_lair", mod_is_loaded: "magiclysm" },
    "恶魔蜘蛛巢穴": { om_terrain: "demon_spider_lair", om_special: "demon_spider_lair", mod_is_loaded: "magiclysm" },
    "奇迹熔炉": { om_terrain: "forge_1A", om_special: "forge_of_wonders", mod_is_loaded: "magiclysm" },
    "精灵工坊": { om_terrain: "elf_workshop", om_special: "elf_workshop", mod_is_loaded: "magiclysm" },
    "魔法学院": { om_terrain: "magic_academy_ground", om_special: undefined, mod_is_loaded: "magiclysm" },
    "魔法商店": { om_terrain: "magic_shop", om_special: undefined, mod_is_loaded: "magiclysm" },
    "法师塔1": { om_terrain: "wizardtower1_ground", om_special: undefined, mod_is_loaded: "magiclysm" },
    "法师塔2": { om_terrain: "wizardtower2_ground", om_special: undefined, mod_is_loaded: "magiclysm" },
    "森林墓穴": { om_terrain: "forest_tomb", om_special: "forest_tomb", mod_is_loaded: "magiclysm" },
    "科技法师的家": { om_terrain: "house_technomancer_1", om_special: undefined, mod_is_loaded: "magiclysm" },
    "超然者的家": { om_terrain: "house_detatched5", om_special: undefined, mod_is_loaded: "magiclysm" },
    "荒野求生洞穴": { om_terrain: "cave_innawood", om_special: "Cave", mod_is_loaded: "innawood" },
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
        description: "寻找一个选定的目标地点, 并将其标记在任务面板中, 重复寻找同目标会遗弃上一个标记",
        shape: "blast",
        valid_targets: ["self"],
    };
    out.push(sp);
    //处理预定义地块
    const subeocIdList = [];
    const nameList = [];
    let index = 0;
    for (const omname in OMNameIDMap) {
        const { om_special, om_terrain, mod_is_loaded, global_unique, om_terrain_match_type } = OMNameIDMap[omname];
        const misid = om_terrain + index++;
        const miss = {
            type: "mission_definition",
            name: `寻路术 ${omname}`,
            difficulty: 0,
            value: 0,
            description: `寻路术帮你标记了一个 ${global_unique ? "唯一" : "未知"} 的 ${omname}`,
            id: `${id}_mission_${misid}`,
            goal: "MGOAL_GO_TO",
            dialogue: MissionDefinition_1.EmptyMissionDialog,
            origins: ["ORIGIN_ANY_NPC"],
            invisible_on_complete: true,
            start: {
                assign_mission_target: {
                    om_special, om_terrain, om_terrain_match_type,
                    reveal_radius: 3,
                    cant_see: global_unique ? undefined : true,
                    search_range: 1200,
                    z: 0
                }
            }
        };
        out.push(miss);
        if (global_unique != true) {
            const subeoc = {
                id: `${id}_eoc_${misid}`,
                type: "effect_on_condition",
                eoc_type: "ACTIVATION",
                effect: [
                    { remove_active_mission: miss.id },
                    { assign_mission: miss.id },
                    { u_message: `你在任务面板里记下了 ${omname} 的位置...` }
                ],
                condition: mod_is_loaded ? { mod_is_loaded } : undefined
            };
            out.push(subeoc);
            subeocIdList.push(subeoc.id);
        }
        else {
            const cond = [{ not: { u_has_mission: miss.id } }];
            if (mod_is_loaded)
                cond.push({ mod_is_loaded });
            const subeoc = {
                id: `${id}_eoc_${misid}`,
                type: "effect_on_condition",
                eoc_type: "ACTIVATION",
                effect: [
                    { assign_mission: miss.id },
                    { u_message: `你在任务面板里记下了 ${omname} 的位置...` }
                ],
                condition: { and: cond }
            };
            out.push(subeoc);
            subeocIdList.push(subeoc.id);
        }
        nameList.push(omname);
    }
    //处理自定义地块
    /*
    const custVar = `${id}_custom_var`;
    const custMiss:MissionDefinition={
        type:"mission_definition",
        name:`寻路术 自定目标`,
        difficulty:0,
        value:0,
        description:`寻路术帮你标记了一个未知的 自定目标`,
        id:`${id}_mission_custom` as MissionDefinitionID,
        goal:"MGOAL_GO_TO",
        dialogue:EmptyMissionDialog,
        origins:["ORIGIN_ANY_NPC"],
        invisible_on_complete:true,
        start:{
            assign_mission_target:{
                om_terrain:{global_val:custVar},
                reveal_radius: 1,
                cant_see:true,
                search_range: 360,
                z:0
            }
        }
    }
    out.push(custMiss);
    const subeoc:Eoc={
        id:`${id}_eoc_custom` as EocID,
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        effect:[
            {remove_active_mission:custMiss.id},
            {assign_mission:custMiss.id},
            {u_message:`你在任务面板里记下了 自定目标 的位置...`}
        ]
    }
    out.push(subeoc);
    */
    //传入主eoc
    maineoc.effect?.push({
        run_eoc_selector: subeocIdList,
        names: nameList,
        hide_failing: true,
        title: "选择你想要寻找的地点"
    });
    dm.addStaticData(out, "common_resource", "PathfindingSpell");
}
exports.createPathfindingSpell = createPathfindingSpell;
