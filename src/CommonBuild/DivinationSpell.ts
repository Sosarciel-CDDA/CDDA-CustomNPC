import { EmptyMissionDialog, MissionDefinition, MissionDefinitionID, OMTMatchType } from "cdda-schema";
import { DataManager } from "@src/DataManager";
import { JObject } from "@zwa73/utils";
import { BoolObj, Eoc, EocID, Spell, SpellID, OvermapTerrainID, OverMapSpecialID } from "cdda-schema";





/**寻路术的名称:地块 表 */
type OMNameMap = Record<string,{
    /**目标地块 */
    om_terrain:OvermapTerrainID;
    /**特殊地点 */
    om_special?:OverMapSpecialID;
    /**目标mod */
    mod_is_loaded?:string;
    /**是否世界唯一 */
    global_unique?:boolean;
    /**匹配方式 */
    om_terrain_match_type?:OMTMatchType;
}>

const OMNameIDMap:OMNameMap={
    //生物
    "蚁巢"                : { om_terrain:"anthill"                      , om_special:"anthill"                   },
    "酸蚁巢"              : { om_terrain:"acid_anthill"                 , om_special:undefined                   },
    "寄生蜂"              : { om_terrain:"nest_dermatik"                , om_special:"Large Dermatik Nest"       },
    "蜂巢"                : { om_terrain:"hive"                         , om_special:"Bee Hive"                  },
    "巨型网蛛"            : { om_terrain:"forest"                       , om_special:"mx_spider"                 },
    "蜘蛛巢穴"            : { om_terrain:"spider_pit"                   , om_special:"Spider Pit"                },
    "真菌花林"            : { om_terrain:"fungal_bloom"                 , om_special:"Fungal Bloom"              },
    "真菌塔"              : { om_terrain:"fungal_tower"                 , om_special:"Fungal Tower"              },
    "真菌花"              : { om_terrain:"fungal_flowers"               , om_special:"Fungal Flowers"            },
    "蝙蝠洞"              : { om_terrain:"cave_rat"                     , om_special:"Rat Cave"                  },
    "虚空蜘蛛巢穴"        : { om_terrain:"void_spider_lair_entrance"    , om_special:"void_spider_lair"          },
    "米·戈营地"           : { om_terrain:"mi-go_camp1"                  , om_special:"Mi-Go Encampment"          },
    "米·戈侦察塔"         : { om_terrain:"mi-go_scout_tower_1"          , om_special:"Mi-Go Scout Tower"         },
    "米·戈传送门"         : { om_terrain:"mi-go_portal"                 , om_special:"Mi-Go Portal"              },
    "三尖树之林"          : { om_terrain:"triffid_grove"                , om_special:"Triffid Grove"             },
    "海怪巢穴"            : { om_terrain:"river_cave"                   , om_special:undefined                   },
    "变形怪坑"            : { om_terrain:"slimepit_top"                 , om_special:"Slime Pit"                 },
    "哥布林营地"          : { om_terrain:"goblin_1A"                    , om_special:"goblin_encampment"         , mod_is_loaded:"magiclysm"  },
    "兽人村落"            : { om_terrain:"orc_village"                  , om_special:"orc_village"               , mod_is_loaded:"magiclysm"  },
    "巴洛炎魔"            : { om_terrain:"mine_balrog_central"          , om_special:"Balrog mine"               , mod_is_loaded:"magiclysm"  },
    "黑龙沼泽"            : { om_terrain:"black_dragon_lair_z-0_NW"     , om_special:"black_dragon_lair"         , mod_is_loaded:"magiclysm"  },
    "恶魔蜘蛛巢穴"        : { om_terrain:"demon_spider_lair"            , om_special:"demon_spider_lair"         , mod_is_loaded:"magiclysm"  },

    //野外资源
    "河流"                : { om_terrain:"river_center"                 , om_special:undefined                   },
    "粘土矿床"            : { om_terrain:"forest"                       , om_special:"mx_clay_deposit"           },
    "沙地"                : { om_terrain:"field"                        , om_special:"mx_sand_patch"             },
    "温泉"                : { om_terrain:"hot_springs"                  , om_special:"Hot Springs"               },
    "洞穴"                : { om_terrain:"cave"                         , om_special:"Cave"                      },


    //资源点
    "中央实验室"          : { om_terrain:"central_lab_finale"                            , om_special:"Central Lab"                 , global_unique:true },//central_lab_entrance central_lab_finale
    "科学实验室"          : { om_terrain:"lab_stairs"                                    , om_special:"Lab"                         },//lab_stairs lab_finale
    "冷冻实验室"          : { om_terrain:"ice_lab_stairs"                                , om_special:"Ice Lab"                     },//ice_lab_stairs ice_lab_finale
    "实验室大楼"          : { om_terrain:"tower_lab_finale"                              , om_special:undefined                     },
    "科研大楼"            : { om_terrain:"lab_surface_brick_blockA0"                     , om_special:"lab_surface_big"             },
    "实验室隐藏入口"      : { om_terrain:"basement_hidden_lab_stairs"                    , om_special:"basement_hidden_lab_entrance"},
    "军事基地"            : { om_terrain:"mil_base_1a"                                   , om_special:"mil_base"                    },
    "神秘庙宇"            : { om_terrain:"temple_stairs"                                 , om_special:"Strangle Temple"             },
    "跨洋物流"            : { om_terrain:"full_basic_lab_roof"                           , om_special:"lab_mutagen_6_level"         },
    "倒塌大楼"            : { om_terrain:"office_tower_collapse_a0"                      , om_special:undefined                     },
    "医院大楼"            : { om_terrain:"urban_35_7"                                    , om_special:undefined                     },
    "医院"                : { om_terrain:"hospital_1"                                    , om_special:undefined                     },
    "放射地埋点"          : { om_terrain:"haz_sar_1_1"                                   , om_special:"Hazardous Waste Sarcophagus" },
    "航母"                : { om_terrain:"aircraft_carrier_1a"                           , om_special:"aircraft_carrier"            , global_unique:true },
    "核电站"              : { om_terrain:"nuclear_plant_0_0_0"                           , om_special:"nuclear power plant"         , global_unique:true },
    "异界实验室"          : { om_terrain:"microlab_portal_MSU14"                         , om_special:undefined                     },
    "4x4微型实验室"       : { om_terrain:"microlab_ratkin"                               , om_special:"4x4_microlab_rodent"         },
    "地表4x4微型实验室"   : { om_terrain:"microlab_generic_surface_connector"            , om_special:"4x4_microlab_surface"        },
    "通风井4x4微型实验室" : { om_terrain:"microlab_generic_vent_shaft_connector"         , om_special:"4x4_microlab_vent_shaft"     },
    "地表实验室"          : { om_terrain:"lab_surface_brick_basementD1_hidden_lab_stairs", om_special:"lab_surface_big"             },
    "Phavian实验室"       : { om_terrain:"psi_phavian_lab_basementD1_hidden_lab_stairs"  , om_special:"phavian_surface_lab"         , mod_is_loaded:"mindovermatter"},
    "4x4恐龙实验室"       : { om_terrain:"microlab_DinoLab_surface"                      , om_special:"4x4_DinoLab_surface"         , mod_is_loaded:"DinoMod"    },
    "人体强化诊所"        : { om_terrain:"afs_augmentation_clinic_n1"                    , om_special:undefined                     , mod_is_loaded:"aftershock" },
    "精灵工坊"            : { om_terrain:"elf_workshop"                                  , om_special:"elf_workshop"                , mod_is_loaded:"magiclysm"  },
    "魔法学院"            : { om_terrain:"magic_academy_ground"                          , om_special:undefined                     , mod_is_loaded:"magiclysm"  },
    "魔法商店"            : { om_terrain:"magic_shop"                                    , om_special:undefined                     , mod_is_loaded:"magiclysm"  },
    "法师塔1"             : { om_terrain:"wizardtower1_ground"                           , om_special:undefined                     , mod_is_loaded:"magiclysm"  },
    "法师塔2"             : { om_terrain:"wizardtower2_ground"                           , om_special:undefined                     , mod_is_loaded:"magiclysm"  },
    "科技法师的家"        : { om_terrain:"house_technomancer_1"                          , om_special:undefined                     , mod_is_loaded:"magiclysm"  },
    "魔法草甸"            : { om_terrain:"magic_field_a1"                                , om_special:"magic_field"                 , mod_is_loaded:"magiclysm"  },

    //重要地点
    "坠毁客机"            : { om_terrain:"airliner_2b"                  , om_special:"airliner_crashed"          },
    "安静的农场"          : { om_terrain:"unvitrified_farm_0"           , om_special:"quiet_farm"                , global_unique:true },
    "避难所"              : { om_terrain:"necropolis_a_1"               , om_special:"Necropolis"                , mod_is_loaded:"no_hope"    },
    "坠毁飞船"            : { om_terrain:"crashing_ship_3"              , om_special:"crashing ship"             , mod_is_loaded:"aftershock" , global_unique:true },
    "调谐祭坛"            : { om_terrain:"attunement_altar_NW"          , om_special:"attunement altar"          , mod_is_loaded:"magiclysm"  },
    "古老石阵"            : { om_terrain:"standing_teleport_stones"     , om_special:"standing_teleport_stones"  , mod_is_loaded:"magiclysm"  },

    //npc据点
    "HUB 01"              : { om_terrain:"robofachq_roof_a0"            , om_special:"hub_01"                    , global_unique:true },
    "难民中心"            : { om_terrain:"refctr_NW1a"                  , om_special:"evac_center"               , global_unique:true },
    "格鲁斯卡普的狩猎小屋": { om_terrain:"lodge_ground_glooscap1"       , om_special:"Hunting Lodge Glooscap"    , global_unique:true },
    "教堂避难所"          : { om_terrain:"godco_1"                      , om_special:"New England Church Retreat", global_unique:true },
    "伊舍伍德农场"        : { om_terrain:"farm_isherwood_1"             , om_special:"Isherwood Farms"           },
    "码头"                : { om_terrain:"lake_dock_small"              , om_special:undefined                   },
    "墓地"                : { om_terrain:"cemetery_4square_00"          , om_special:undefined                   },
    "商会工坊"            : { om_terrain:"isolated_house_farm_gunsmith" , om_special:"isolated_road"             },
    "木材厂"              : { om_terrain:"lumbermill_0_0_ocu"           , om_special:undefined                   },
    "流亡族基地"          : { om_terrain:"exodii_base_x0y3z0"           , om_special:"exodii_base"               },
    "奇迹熔炉"            : { om_terrain:"forge_1A"                     , om_special:"forge_of_wonders"          , mod_is_loaded:"magiclysm"  },
    "生化先驱者苹果园"    : { om_terrain:"prepnet_orchard"              , om_special:"prepnet_orchard"           , mod_is_loaded:"aftershock" , global_unique:true },
    "奇怪的LMOE避难所"    : { om_terrain:"whately_lmoe"                 , om_special:"Strange LMOE Shelter"      , mod_is_loaded:"aftershock" },

    //杂项
    "月神公园"            : { om_terrain:"luna_park_0_0_0"               , om_special:"Luna Park"                 },
    "微缩铁路"            : { om_terrain:"miniaturerailway_0_0_0"        , om_special:"miniature railway"         },
    "炼钢厂"              : { om_terrain:"steel_mill_0_1"                , om_special:"steel mill"                },
    "幸存者地堡"          : { om_terrain:"ws_survivor_bunker_f0"         , om_special:"ws_survivor_bunker_place"  },
    "幸存者营地"          : { om_terrain:"ws_survivor_camp"              , om_special:"ws_survivor_camp_place"    },
    "天坑"                : { om_terrain:"ws_giant_sinkhole_1"           , om_special:"ws_giant_sinkhole"         },
    "牧场"                : { om_terrain:"ranch_camp_1"                  , om_special:"ranch_camp"                },
    "强盗小屋"            : { om_terrain:"bandit_cabin"                  , om_special:"bandit_cabin"              },
    "强盗营地"            : { om_terrain:"bandit_camp_1"                 , om_special:"bandit_camp"               },
    "强盗毒品实验室"      : { om_terrain:"bandit_drug_lab"               , om_special:"bandit_drug_lab"           },
    "强盗农场"            : { om_terrain:"bandit_farm_1"                 , om_special:"bandit_work_camp"          },
    "强盗车库"            : { om_terrain:"bandit_garage_1"               , om_special:"bandit_garage"             },
    "毒品实验室"          : { om_terrain:"drug_lab"                      , om_special:"drug_lab"                  },
    "军事掩体"            : { om_terrain:"bunker"                        , om_special:"military_bunker_1"         },
    "军事哨站"            : { om_terrain:"outpost"                       , om_special:"military_outpost"          },
    "十字军事哨站"        : { om_terrain:"outpost_cross"                 , om_special:"military_outpost_cross"    },
    "导弹发射井"          : { om_terrain:"silo"                          , om_special:"Missile Silo"              },
    "军用直升机停机坪"    : { om_terrain:"helipad_nw"                    , om_special:"military helipad"          },
    "私人机场"            : { om_terrain:"s_air_term"                    , om_special:"o_airport"                 },
    "城堡要塞"            : { om_terrain:"fort_1a"                       , om_special:"Bastion Fort"              },
    "地堡商店"            : { om_terrain:"bunker_shop_g"                 , om_special:"bunker shop"               },
    "地堡加油站"          : { om_terrain:"s_gas_g0"                      , om_special:"gas station bunker"        },
    "疗养院"              : { om_terrain:"nursing_home"                  , om_special:"nursing_home"              , om_terrain_match_type:"PREFIX"},
    "退休社区"            : { om_terrain:"retirement_community_1"        , om_special:"retirement_community"      },
    "农场用品店"          : { om_terrain:"farm_supply_1"                 , om_special:"Farm Supply Store"         },
    "洗劫一空的农场用品店": { om_terrain:"farm_supply_looted_1"          , om_special:"Farm Supply Store Looted"  },
    "赛车跑道"            : { om_terrain:"speedway_0_0"                  , om_special:"speedway"                  },
    "黄蜂占据的无线发射塔": { om_terrain:"wasp_tower"                    , om_special:"Wasp Tower"                , om_terrain_match_type:"PREFIX"},
    "监狱"                : { om_terrain:"prison_1_1"                    , om_special:"Prison"                    },
    "恶魔岛监狱"          : { om_terrain:"prison_alcatraz_1"             , om_special:"Alcatraz Prison"           },
    "海岛监狱"            : { om_terrain:"prison_island_1_1"             , om_special:"Island prison"             },
    "监狱实验室"          : { om_terrain:"prison_1_b_8_hidden_lab_stairs", om_special:"Prison Hidden Lab"         },
    "狩猎小屋"            : { om_terrain:"lodge_basement_residential1"   , om_special:"Hunting Lodge"             },
    "市污水处理站"        : { om_terrain:"sewage_treatment_0_0_0"        , om_special:"Sewage Treatment Plant"    },
    "LMOE避难所"          : { om_terrain:"lmoe"                          , om_special:"LMOE Shelter"              },
    "被占据的LMOE避难所"  : { om_terrain:"lmoe_zombie"                   , om_special:"Occupied LMOE Shelter"     },
    "上锁的LMOE避难所"    : { om_terrain:"lmoe_prepperquest"             , om_special:"Locked LMOE Shelter"       },
    "怪物尸体"            : { om_terrain:"corpse_tentacle_surface_entry" , om_special:"nether_monster_corpse"     },
    "沉船"                : { om_terrain:"shipwreck_river_1"             , om_special:"Shipwreck"                 },
    "购物中心"            : { om_terrain:"mall_a_1"                      , om_special:undefined                   },
    "诊所"                : { om_terrain:"office_doctor_1"               , om_special:undefined                   },
    "辐照厂"              : { om_terrain:"irradiator_1_5"                , om_special:"irradiator"                },
    "市政机场"            : { om_terrain:"airport_lot_0"                , om_special:"regional_airport"           },
    "市政核电站"          : { om_terrain:"municipal_reactor"             , om_special:undefined                   },
    "私人度假村"          : { om_terrain:"p_resort_pm"                   , om_special:"private_resort"            },
    "酿酒厂"              : { om_terrain:"farm_stills_7"                 , om_special:"Farm Mutable"              },
    "别墅"                : { om_terrain:"mansion"                       , om_special:undefined                   , om_terrain_match_type:"PREFIX" },
    "大学"                : { om_terrain:"campus_admin_0_0_0"            , om_special:"campus"                    },
    "枪械展会"            : { om_terrain:"gunshow_0"                     , om_special:"gun_show"                  },
    "逃兵前哨站"          : { om_terrain:"deserter_city_gate"            , om_special:"deserter_city"             , global_unique:true },
    "森林墓穴"            : { om_terrain:"forest_tomb"                   , om_special:"forest_tomb"               , mod_is_loaded:"magiclysm"  },
    "超然者的家"          : { om_terrain:"house_detatched5"              , om_special:undefined                   , mod_is_loaded:"magiclysm"  },
    "荒野求生洞穴"        : { om_terrain:"cave_innawood"                 , om_special:"Cave"                      , mod_is_loaded:"innawood"   },
    "边境巡逻队办公室"    : { om_terrain:"field_office_ex_5"             , om_special:"field_office_ferals_jotunn", mod_is_loaded:"xedra_evolved"},
    "伊尔德祭坛"          : { om_terrain:"ierde_genius_loci_NW"          , om_special:"ierde altar"               , mod_is_loaded:"xedra_evolved"},
    "奇树祭坛"            : { om_terrain:"arvore_genius_loci_NW"         , om_special:"arvore altar"              , mod_is_loaded:"xedra_evolved"},
    "温蒂妮祭坛"          : { om_terrain:"undine_genius_loci_NW"         , om_special:"undine altar"              , mod_is_loaded:"xedra_evolved"},
    "沙罗曼蛇祭坛"        : { om_terrain:"salamander_genius_loci_NW"     , om_special:"salamander altar"          , mod_is_loaded:"xedra_evolved"},
    "希尔芙祭坛"          : { om_terrain:"sylph_genius_loci_NW"          , om_special:"sylph altar"               , mod_is_loaded:"xedra_evolved"},
    "荷穆勒斯祭坛"        : { om_terrain:"homullus_genius_loci_NW"       , om_special:"homullus altar"            , mod_is_loaded:"xedra_evolved"},
} as const as any;


export async function createDivinationSpell(dm:DataManager){
    const out:JObject[]=[];
    const sid = "DivinationSpell";
    const sname = "预言术";

    const maineoc:Eoc={
        id:`${sid}_eoc` as EocID,
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        effect:[]
    }
    out.push(maineoc);

    const sp:Spell={
        type:"SPELL",
        id:sid as SpellID,
        effect:"effect_on_condition",
        effect_str:maineoc.id,
        name:sname,
        description:"预言一个选定的目标地点, 并将其标记在任务面板中, 重复预言同目标会遗弃上一个标记",
        shape:"blast",
        valid_targets:["self"],
    }
    out.push(sp);


    //处理预定义地块
    const subeocIdList:EocID[] = [];
    const nameList:string[] = [];
    let index=0;
    for(const omname in OMNameIDMap){
        const {om_special,om_terrain,mod_is_loaded,global_unique,om_terrain_match_type} = OMNameIDMap[omname];

        const misid = om_terrain+index++;

        const miss:MissionDefinition={
            type:"mission_definition",
            name:`${sname}: ${omname}`,
            difficulty:0,
            value:0,
            description:`${sname}标记了 ${global_unique?"唯一一个":"一个未知的"} ${omname}`,
            id:`${sid}_mission_${misid}` as MissionDefinitionID,
            goal:"MGOAL_GO_TO",
            //dialogue:EmptyMissionDialog,
            invisible_on_complete:true,
            start:{
                assign_mission_target:{
                    om_special,om_terrain,om_terrain_match_type,
                    reveal_radius: 3,
                    cant_see:global_unique ? undefined : true,
                    search_range: 1200,
                    z:0
                }
            }
        }
        out.push(miss);

        if(global_unique!=true){
            const subeoc:Eoc={
                id:`${sid}_eoc_${misid}` as EocID,
                type:"effect_on_condition",
                eoc_type:"ACTIVATION",
                effect:[
                    {remove_active_mission:miss.id},
                    {assign_mission:miss.id},
                    {u_message:`你在任务面板里记下了 ${omname} 的位置……`}
                ],
                condition:mod_is_loaded?{mod_is_loaded}:undefined
            }
            out.push(subeoc);
            subeocIdList.push(subeoc.id);
        }else{
            const cond: (BoolObj)[] = [{not:{u_has_mission:miss.id}}];
            if(mod_is_loaded)
                cond.push({mod_is_loaded});
            const subeoc:Eoc={
                id:`${sid}_eoc_${misid}` as EocID,
                type:"effect_on_condition",
                eoc_type:"ACTIVATION",
                effect:[
                    {assign_mission:miss.id},
                    {u_message:`你在任务面板里记下了 ${omname} 的位置……`}
                ],
                condition:{and:cond}
            }
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
            {u_message:`你在任务面板里记下了 自定目标 的位置……`}
        ]
    }
    out.push(subeoc);
    */

    //传入主eoc
    maineoc.effect?.push({
        run_eoc_selector:subeocIdList,
        names:nameList,
        hide_failing:true,
        title:"选择你想要预言的地点"
    })
    dm.addStaticData(out,"common_resource","DivinationSpell");
}