import { Eoc, EocEffect, EocID, EocType } from "@/cdda-schema";



/**角色互动事件 */
export type CharActEventType = [
    "MeleeAttackChar"       ,//尝试近战攻击角色
    "MeleeAttackMons"       ,//尝试近战攻击怪物
    "RangeAttackChar"       ,//尝试远程攻击角色
    "RangeAttackMons"       ,//尝试远程攻击怪物
    "MeleeAttack"           ,//尝试近战攻击
    "RangeAttack"           ,//尝试远程攻击
    "Attack"                ,//尝试攻击
    "CauseMeleeHit"         ,//近战攻击命中
    "MissMeleeHit"          ,//近战攻击未命中
][number];
/**任何角色事件 */
export type CharEventType = [
    CharActEventType        ,
    "Update"                ,//刷新
    "SlowUpdate"            ,//60秒刷新
    "TakeDamage"            ,//受到伤害
    "Death"                 ,//死亡
    "EnterBattle"           ,//进入战斗
    "BattleUpdate"          ,//进入战斗时 刷新
    "NonBattleUpdate"       ,//非战斗时 刷新
][number];
/**全局事件列表 */
export type GlobalEventType = [
    CharEventType           ,
    "AvaterMove"            ,//玩家移动
    "AvaterUpdate"          ,//玩家刷新
    "GameBegin"             ,//每次进入游戏时
][number];

export type EventObj = {
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
}

export function genEventEoc(prefix:string){
    const eid = (id:GlobalEventType)=>`${prefix}_${id}` as EocID;
    const rune = (id:GlobalEventType)=>({run_eocs:eid("MeleeAttack")});
    const uvar = (id:string)=>`u_${prefix}_${id}`;
    const nvar = (id:string)=>`n_${prefix}_${id}`;
    const defObj:EventObj={
        base_setting: {
            eoc_type: "ACTIVATION"
        }
    }
    const eventMap:Record<GlobalEventType,EventObj>={
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
        },
        MeleeAttackChar:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_melee_attacks_character"
            },
            invoke_effects:[rune("MeleeAttack")]
        },
        MeleeAttackMons:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_melee_attacks_monster"
            },
            invoke_effects:[rune("MeleeAttack")]
        },
        MeleeAttack:{
            base_setting: {
                eoc_type: "ACTIVATION"
            },
            invoke_effects:[rune("Attack"),{
                if:{math:["_hits","==","1"]},
                then:[rune("CauseMeleeHit")],
                else:[rune("MissMeleeHit")],
            }]
        },
        CauseMeleeHit:defObj,
        MissMeleeHit:defObj,
        RangeAttackChar:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_ranged_attacks_character"
            },
            invoke_effects:[rune("RangeAttack")]
        },
        RangeAttackMons:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_ranged_attacks_monster"
            },
            invoke_effects:[rune("RangeAttack")]
        },
        RangeAttack:{
            base_setting: {
                eoc_type: "ACTIVATION"
            },
            invoke_effects:[rune("Attack")]
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
        Death:{
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_dies"
            }
        },
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
    const eocMap:Record<GlobalEventType,Eoc> = {} as any;
    for(const key in eventMap){
        const fixkey = key as GlobalEventType;
        const event = eventMap[fixkey];
        eocMap[fixkey] = {
            type:"effect_on_condition",
            ...event.base_setting,
            id:`${prefix}_${key}_EVENT` as EocID
        }
    }
    return eocMap;
}