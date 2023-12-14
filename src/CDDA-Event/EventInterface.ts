import { Eoc, EocEffect, EocID, EocType } from "cdda-schema";


/**角色互动事件 列表 */
export const InteractiveHookList = [
    "TryMeleeAtkChar"       ,//尝试近战攻击角色
    "TryMeleeAtkMon"        ,//尝试近战攻击怪物
    "TryRangeAtkChar"       ,//尝试远程攻击角色
    "TryRangeAtkMon"        ,//尝试远程攻击怪物
    "TryMeleeAttack"        ,//尝试近战攻击
    "TryRangeAttack"        ,//尝试远程攻击
    "Attack"                ,//尝试攻击
    "SucessMeleeAttack"     ,//近战攻击命中
    "MissMeleeAttack"       ,//近战攻击未命中
] as const;
/**角色互动事件  
 * u为角色 n为目标角色  
 */
export type InteractiveHook = typeof InteractiveHookList[number];

/**任何角色事件 列表*/
export const CharHookList = [
    ...InteractiveHookList ,//
    "Update"                    ,//刷新
    "SlowUpdate"                ,//60秒刷新
    "TakeDamage"                ,//受到伤害
    "DeathPrev"                 ,//死亡
    "Death"                     ,//死亡
    "EnterBattle"               ,//进入战斗
    "BattleUpdate"              ,//进入战斗时 刷新
    "NonBattleUpdate"           ,//非战斗时 刷新
] as const;
/**任何角色事件  
 * u为角色 n未定义  
 */
export type CharHook = typeof CharHookList[number];

/**全局事件列表 列表 */
export const GlobalHookList = [
    "AvaterMove"            ,//玩家移动
    "AvaterUpdate"          ,//玩家刷新
    "GameBegin"             ,//每次进入游戏时
] as const;
/**全局事件  
 * u为主角 n未定义  
 */
export type GlobalHook = typeof GlobalHookList[number];

/**任何事件 列表 */
export const AnyEventTypeList = [
    ...GlobalHookList  ,
    ...CharHookList    ,
] as const;
/**任何事件  
 * u n 均未定义
 */
export type AnyHook = typeof AnyEventTypeList[number];



type DefineHookObj = {
    /**基础设置 */
    base_setting:{
        /**eoc类型 */
        eoc_type: EocType;
        /**event依赖 */
        required_event?: string;
        /**刷新间隔/秒 */
        recurrence?: number;
        /**全局刷新 */
        global?: true;
        /**运行于npc */
        run_for_npcs?: true;
    }
    /**运行此事件时将会附带调用的EocEffect */
    invoke_effects?: EocEffect[];
    /**关联事件 */
    link_events?: AnyHook[];
}

export function genEventEoc(prefix:string):Record<AnyHook,Eoc>{
    const eid = (id:AnyHook)=>`${prefix}_${id}` as EocID;
    const rune = (id:AnyHook)=>({run_eocs:eid(id)});
    const uvar = (id:string)=>`u_${prefix}_${id}`;
    const nvar = (id:string)=>`n_${prefix}_${id}`;
    //默认Hook
    const defObj:DefineHookObj={
        base_setting: {
            eoc_type: "ACTIVATION"
        }
    }
    //预定义的Hook
    const eventMap:Record<AnyHook,DefineHookObj>={
        GameBegin:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "game_begin"
            }
        },
        TakeDamage:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_takes_damage"
            }
            /*
            { "character", character_id }
            { "damage", int }
	        */
        },
        TryMeleeAtkChar:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_melee_attacks_character"
            },
            invoke_effects:[rune("TryMeleeAttack")],
            link_events:["TryMeleeAttack"]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "hits", bool },
            { "victim", character_id },
            { "victim_name", string },
            */
        },
        TryMeleeAtkMon:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_melee_attacks_monster"
            },
            invoke_effects:[rune("TryMeleeAttack")],
            link_events:["TryMeleeAttack"]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "hits", bool },
            { "victim_type", mtype_id },
            */
        },
        TryMeleeAttack:{
            base_setting: {
                eoc_type: "ACTIVATION"
            },
            invoke_effects:[rune("Attack"),{
                if:{math:["_hits","==","1"]},
                then:[rune("SucessMeleeAttack")],
                else:[rune("MissMeleeAttack")],
            }],
            link_events:["Attack","TryMeleeAtkChar","TryMeleeAtkMon","SucessMeleeAttack","MissMeleeAttack"]
        },
        SucessMeleeAttack:{
            base_setting:defObj.base_setting,
            link_events:["TryMeleeAttack"]
        },
        MissMeleeAttack:{
            base_setting:defObj.base_setting,
            link_events:["TryMeleeAttack"]
        },
        TryRangeAtkChar:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_ranged_attacks_character"
            },
            invoke_effects:[rune("TryRangeAttack")],
            link_events:["TryRangeAttack"]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "victim", character_id },
            { "victim_name", string },
            */
        },
        TryRangeAtkMon:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_ranged_attacks_monster"
            },
            invoke_effects:[rune("TryRangeAttack")],
            link_events:["TryRangeAttack"]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "victim_type", mtype_id },
            */
        },
        TryRangeAttack:{
            base_setting: {
                eoc_type: "ACTIVATION"
            },
            invoke_effects:[rune("Attack")],
            link_events:["Attack","TryRangeAttack"]
        },
        Attack:{
            base_setting:defObj.base_setting,
            invoke_effects:[{
                if:{math:[uvar("inBattle"),"<=","0"]},
                then:[rune("EnterBattle")],
            },{math:[uvar("inBattle"),"=","60"]}]
        },
        EnterBattle:defObj,
        BattleUpdate:defObj,
        NonBattleUpdate:defObj,
        DeathPrev:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_dies"
            },
            invoke_effects:[{
                if:{or:[{math:["u_hp('head')","<=","0"]},{math:["u_hp('torso')","<=","0"]}]},
                then:[rune("Death")],
            }]
            //{ "character", character_id },
        },
        Death:defObj,
        AvaterMove:{
            base_setting: {
                eoc_type: "OM_MOVE"
            }
        },
        Update:{
            base_setting: {
                eoc_type:"RECURRING",
                recurrence: 1,
                global: true,
                run_for_npcs: true
            },
            invoke_effects:[{
                if:{math:[uvar("inBattle"),">","0"]},
                then:[rune("BattleUpdate"),{math:[uvar("inBattle"),"-=","1"]}],
                else:[rune("NonBattleUpdate")]
            },{
                if:{math:[uvar("slowCounter"),">=","60"]},
                then:[rune("SlowUpdate"),{math:[uvar("slowCounter"),"=","1"]}],
                else:[{math:[uvar("slowCounter"),"+=","1"]}]
            }]
        },
        SlowUpdate:defObj,
        AvaterUpdate:{
            base_setting: {
                eoc_type:"RECURRING",
                recurrence: 1
            }
        }
    };
    const eocMap:Record<AnyHook,Eoc> = {} as any;
    for(const key in eventMap){
        const fixkey = key as AnyHook;
        const event = eventMap[fixkey];
        eocMap[fixkey] = {
            type:"effect_on_condition",
            ...event.base_setting,
            id:`${prefix}_${key}_EVENT` as EocID
        }
    }
    return eocMap;
}