import { EmptyMissionDialog, MissionDefinition, MissionDefinitionID } from "@src/CddaJsonFormat/MissionDefinition";
import { OverMapSpecialID } from "@src/CddaJsonFormat/OvermapSpecial";
import { OvermapTerrainID } from "@src/CddaJsonFormat/OvermapTerrain";
import { DataManager } from "@src/DataManager";
import { JObject } from "@zwa73/utils";
import { Eoc, EocID, Spell, SpellID } from "CddaJsonFormat";





/**寻路术的名称:地块 表 */
type OMNameMap = Record<string,{
    /**特殊地点 */
    om_special:OverMapSpecialID|undefined;
    /**目标地块 */
    om_terrain:OvermapTerrainID;
    /**目标mod */
    mod_is_loaded?:string;
}>

const OMNameIDMap:OMNameMap={
    //"lab_stairs":"科学实验室"
    "蚁巢"          : {om_special:"anthill"             , om_terrain: "anthill"                             ,mod_is_loaded:undefined    },
    "酸蚁巢"        : {om_special:undefined             , om_terrain: "acid_anthill"                          ,mod_is_loaded:undefined    },
    "寄生蜂"        : {om_special:"Large Dermatik Nest" , om_terrain: "nest_dermatik"                          ,mod_is_loaded:undefined    },
    "巨型网蛛"      : {om_special:"mx_spider"           , om_terrain: "forest"                          ,mod_is_loaded:undefined    },
    "蜘蛛巢穴"      : {om_special:"Spider Pit"          , om_terrain: "spider_pit"                          ,mod_is_loaded:undefined    },
    "蜘蛛巢穴"      : {om_special:"Spider Pit"          , om_terrain: "spider_pit"                          ,mod_is_loaded:undefined    },
    "蜘蛛巢穴"      : {om_special:"Spider Pit"          , om_terrain: "spider_pit"                          ,mod_is_loaded:undefined    },
    "蜘蛛巢穴"      : {om_special:"Spider Pit"          , om_terrain: "spider_pit"                          ,mod_is_loaded:undefined    },
    "蜘蛛巢穴"      : {om_special:"Spider Pit"          , om_terrain: "spider_pit"                          ,mod_is_loaded:undefined    },
    
    "科学实验室"    : {om_special:"Lab"                 , om_terrain: "lab_stairs"                          ,mod_is_loaded:undefined    },
    "军事基地"      : {om_special:"mil_base"            , om_terrain: "road_end_north"                      ,mod_is_loaded:undefined    },
    "中央实验室"    : {om_special:"Central Lab"         , om_terrain: "central_lab_entrance"                ,mod_is_loaded:undefined    },
    "冷冻实验室"    : {om_special:"Ice Lab"             , om_terrain: "ice_lab_stairs"                      ,mod_is_loaded:undefined    },
    "避难所"        : {om_special:"Necropolis"          , om_terrain: "necropolis_a_1_north"                ,mod_is_loaded:undefined    },
    "科研大楼"      : {om_special:"lab_surface_big"     , om_terrain: "lab_surface_brick_basementA0_north"  ,mod_is_loaded:undefined    },
    "HUB 01"        : {om_special:"hub_01"              , om_terrain: "robofachq_roof_a0_north"             ,mod_is_loaded:undefined    },
    "难民中心"      : {om_special:"evac_center"         , om_terrain: "refctr_NW1a_north"                   ,mod_is_loaded:undefined    },
    "跨洋物流"      : {om_special:"lab_mutagen_6_level" , om_terrain: "full_basic_lab_roof_north"           ,mod_is_loaded:undefined    },
    "黑龙沼泽"      : {om_special:"black_dragon_lair"   , om_terrain: "black_dragon_lair_z-0_NW_north"      ,mod_is_loaded:"magiclysm"  },
    "恶魔蜘蛛巢穴"  : {om_special:"demon_spider_lair"   , om_terrain: "demon_spider_lair_north"             ,mod_is_loaded:"magiclysm"  },
    "奇迹熔炉"      : {om_special:"forge_of_wonders"    , om_terrain: "forge_1A_north"                      ,mod_is_loaded:"magiclysm"  },
    "魔法学院"      : {om_special:undefined             , om_terrain: "magic_academy_ground_north"          ,mod_is_loaded:"magiclysm"  },
    "魔法商店"      : {om_special:undefined             , om_terrain: "magic_shop_north"                    ,mod_is_loaded:"magiclysm"  },
    "法师塔1"       : {om_special:undefined             , om_terrain: "wizardtower1_ground_south"           ,mod_is_loaded:"magiclysm"  },
    "法师塔2"       : {om_special:undefined             , om_terrain: "wizardtower2_ground_south"           ,mod_is_loaded:"magiclysm"  },
    "科技法师的家"  : {om_special:undefined             , om_terrain: "house_technomancer_1_north"          ,mod_is_loaded:"magiclysm"  },
    "超然者的家"    : {om_special:undefined             , om_terrain: "house_detatched5_north"          ,mod_is_loaded:"magiclysm"  },
    "科技法师的家"  : {om_special:"house_technomancer"  , om_terrain: "house_technomancer_1_north"          ,mod_is_loaded:"magiclysm"  },
    "科技法师的家"  : {om_special:"house_technomancer"  , om_terrain: "house_technomancer_1_north"          ,mod_is_loaded:"magiclysm"  },
    "科技法师的家"  : {om_special:"house_technomancer"  , om_terrain: "house_technomancer_1_north"          ,mod_is_loaded:"magiclysm"  },
    "科技法师的家"  : {om_special:"house_technomancer"  , om_terrain: "house_technomancer_1_north"          ,mod_is_loaded:"magiclysm"  },
} as const as any;


export function createPathfindingSpell(dm:DataManager){
    const out:JObject[]=[];
    const id = "PathfindingSpell";

    const maineoc:Eoc={
        id:`${id}_eoc` as EocID,
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        effect:[]
    }
    out.push(maineoc);

    const sp:Spell={
        type:"SPELL",
        id:id as SpellID,
        effect:"effect_on_condition",
        effect_str:maineoc.id,
        name:"寻路术",
        description:"寻找一个选定的目标地点, 并将其标记在任务面板中, 重复寻找同目标会遗弃上一个标记",
        shape:"blast",
        valid_targets:["self"],
    }
    out.push(sp);


    //处理预定义地块
    const subeocIdList:EocID[] = [];
    const nameList:string[] = [];
    for(const omname in OMNameIDMap){
        const {om_special,om_terrain,mod_is_loaded} = OMNameIDMap[omname];

        const misid = om_special??om_terrain;

        const miss:MissionDefinition={
            type:"mission_definition",
            name:`寻路术 ${omname}`,
            difficulty:0,
            value:0,
            description:`寻路术帮你标记了一个未知的 ${omname}`,
            id:`${id}_mission_${misid}` as MissionDefinitionID,
            goal:"MGOAL_GO_TO",
            dialogue:EmptyMissionDialog,
            origins:["ORIGIN_ANY_NPC"],
            invisible_on_complete:true,
            start:{
                assign_mission_target:{
                    om_special,om_terrain,
                    reveal_radius: 1,
                    cant_see:true,
                    search_range: 360,
                    z:0
                }
            }
        }
        out.push(miss);

        const subeoc:Eoc={
            id:`${id}_eoc_${misid}` as EocID,
            type:"effect_on_condition",
            eoc_type:"ACTIVATION",
            effect:[
                {remove_active_mission:miss.id},
                {assign_mission:miss.id},
                {u_message:`你在任务面板里记下了 ${omname} 的位置...`}
            ],
            condition:mod_is_loaded?{mod_is_loaded}:undefined
        }
        out.push(subeoc);
        subeocIdList.push(subeoc.id);
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
        run_eoc_selector:subeocIdList,
        names:nameList,
        title:"选择你想要寻找的地点"
    })
    dm.addStaticData(out,"common_resource","PathfindingSpell");
}