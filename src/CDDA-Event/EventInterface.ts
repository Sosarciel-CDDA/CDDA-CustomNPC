import { Eoc, EocEffect, EocID, EocType } from "cdda-schema";

//Interactive
/**角色互动事件 列表 */
export const InteractHookList = [
    "TryMeleeAtkChar"       ,//尝试近战攻击角色
    "TryMeleeAtkMon"        ,//尝试近战攻击怪物
    "TryRangeAtkChar"       ,//尝试远程攻击角色
    "TryRangeAtkMon"        ,//尝试远程攻击怪物
    "TryMeleeAttack"        ,//尝试近战攻击
    "TryRangeAttack"        ,//尝试远程攻击
    "TryAttack"             ,//尝试攻击
    "SucessMeleeAttack"     ,//近战攻击命中
    "MissMeleeAttack"       ,//近战攻击未命中
] as const;
/**角色互动事件  
 * u为角色 n为目标角色  
 */
export type InteractHook = typeof InteractHookList[number];

/**任何角色事件 列表*/
export const CharHookList = [
    ...InteractHookList         ,//
    "Init"                      ,//初始化
    "Update"                    ,//刷新
    "SlowUpdate"                ,//慢速秒刷新
    "TakeDamage"                ,//受到伤害
    "DeathPrev"                 ,//死亡前 恢复生命将自动阻止死亡
    "Death"                     ,//死亡
    "EnterBattle"               ,//进入战斗
    "LeaveBattle"               ,//离开战斗
    "BattleUpdate"              ,//进入战斗时 刷新
    "NonBattleUpdate"           ,//非战斗时 刷新
    "MoveStatus"                ,//移动状态
    "IdleStatus"                ,//待机状态
    "AttackStatus"              ,//攻击状态
] as const;
/**任何角色事件  
 * u为角色 n未定义  
 */
export type CharHook = typeof CharHookList[number];

/**全局事件列表 列表 */
export const GlobalHookList = [
    "AvatarMove"            ,//玩家移动
    "AvatarUpdate"          ,//玩家刷新
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


/**一个Hook */
export type HookObj = {
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
    /**运行此事件前将会附带调用的EocEffect */
    before_effects?: EocEffect[];
    /**运行此事件后将会附带调用的EocEffect */
    after_effects?: EocEffect[];
}

export function genDefineHookMap(prefix:string,statusDur=4,battleDur=60,slowCounter=60){
    const eid = (id:AnyHook)=>`${prefix}_${id}_EVENT` as EocID;
    const rune = (id:AnyHook)=>({run_eocs:eid(id)});
    const uv = (id:string)=>`u_${prefix}_${id}`;
    const nv = (id:string)=>`n_${prefix}_${id}`;
    const gv = (id:string)=>`${prefix}_${id}`;

    //默认Hook
    const defObj:HookObj={
        base_setting: {
            eoc_type: "ACTIVATION"
        }
    }
    //预定义的Hook
    const hookMap:Record<AnyHook,HookObj>={
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
            },
            after_effects:[{
                if:{math:[uv("inBattle"),"<=","0"]},
                then:[rune("EnterBattle")],
            },{math:[uv("inBattle"),"=",`${battleDur}`]}]
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
            after_effects:[rune("TryMeleeAttack")]
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
            after_effects:[rune("TryMeleeAttack")]
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
            after_effects:[rune("TryAttack"),{
                if:{math:["_hits","==","1"]},
                then:[rune("SucessMeleeAttack")],
                else:[rune("MissMeleeAttack")],
            }]
        },
        SucessMeleeAttack:{
            base_setting:defObj.base_setting
        },
        MissMeleeAttack:{
            base_setting:defObj.base_setting
        },
        TryRangeAtkChar:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_ranged_attacks_character"
            },
            after_effects:[rune("TryRangeAttack")]
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
            after_effects:[rune("TryRangeAttack")]
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
            after_effects:[rune("TryAttack")]
        },
        TryAttack:{
            base_setting:defObj.base_setting,
            before_effects:[{math:[uv("notIdleOrMoveStatus"),"=",`${statusDur}`]}],
            after_effects:[{
                if:{math:[uv("inBattle"),"<=","0"]},
                then:[rune("EnterBattle")],
            },{math:[uv("inBattle"),"=",`${battleDur}`]}]
        },
        EnterBattle:defObj,
        LeaveBattle:defObj,
        BattleUpdate:defObj,
        NonBattleUpdate:defObj,
        DeathPrev:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_dies"
            },
            after_effects:[{
                if:{or:[{math:["u_hp('head')","<=","0"]},{math:["u_hp('torso')","<=","0"]}]},
                then:[rune("Death")],
                else:["u_prevent_death"]
            }]
            //{ "character", character_id },
        },
        Death:defObj,
        AvatarMove:{
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
            before_effects:[{
                if:{math:[uv("isInit"),"!=","1"]},
                then:[rune("Init"),{math:[uv("isInit"),"=","1"]}]
            }],
            after_effects:[{
                if:{math:[uv("inBattle"),">","0"]},
                then:[rune("BattleUpdate"),{math:[uv("inBattle"),"-=","1"]},{
                    if:{math:[uv("inBattle"),"<=","0"]},
                    then:[rune("LeaveBattle")],
                }],
                else:[rune("NonBattleUpdate")]
            },{
                if:{math:[uv("slowCounter"),">=",`${slowCounter}`]},
                then:[rune("SlowUpdate"),{math:[uv("slowCounter"),"=","1"]}],
                else:[{math:[uv("slowCounter"),"+=","1"]}]
            },{//将uvar转为全局var防止比较报错
                set_string_var: { u_val: uv("char_preloc") },
                target_var: { global_val: gv("char_preloc") }
            },{//通过比较 loc字符串 检测移动
                if:{compare_string: [
                        { global_val: gv("char_preloc") },
                        { mutator: "loc_relative_u", target: "(0,0,0)" }
                    ]},
                then:[{math:[uv("onMoveStatus"),"=","0"]}],
                else:[{math:[uv("onMoveStatus"),"=","1"]}],
            },//更新 loc字符串
            {u_location_variable:{u_val:uv("char_preloc")}},
            {//触发互斥状态
                if:{math:[uv("notIdleOrMoveStatus"),"<=","0"]},
                then:[{
                    if:{math:[uv("onMoveStatus"),">=","1"]},
                    then:[rune("MoveStatus")],
                    else:[rune("IdleStatus")],
                }],
                else:[rune("AttackStatus"),{math:[uv("notIdleOrMoveStatus"),"-=","1"]}]
            }]
        },
        Init:defObj,
        SlowUpdate:defObj,
        AvatarUpdate:{
            base_setting: {
                eoc_type:"RECURRING",
                recurrence: 1
            }
        },
        MoveStatus:defObj,
        IdleStatus:defObj,
        AttackStatus:defObj,
    };
    return hookMap;
}