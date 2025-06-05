import { EocEffect } from "@sosarciel-cdda/cdda-schema";
import { EventManager } from "@sosarciel-cdda/cdda-event";
import { JObject } from "@zwa73/utils";



/**任何角色的交互事件 列表  
 * u为角色 n为怪物
 */
export const CInteractHookList = [
    "TryMeleeAttack"           ,//尝试近战攻击
    "TryRangeAttack"           ,//尝试远程攻击
    "TryAttack"                ,//尝试攻击
    "SucessMeleeAttack"        ,//近战攻击命中
    "MissMeleeAttack"          ,//近战攻击未命中
] as const;
/**任何角色的交互事件  
 * u为角色 n为怪物
 */
export type CInteractHook = typeof CInteractHookList[number];

/**任何角色通用的事件 列表  
 * u为角色 n不存在
 */
export const CCharHookList = [
    "Update"                ,//刷新 Cnpc角色尽量使用 Update
    "TakeDamage"            ,//受到伤害
    "EnterBattle"           ,//进入战斗
    "BattleUpdate"          ,//进入战斗时 刷新
    "NonBattleUpdate"       ,//非战斗时 刷新
    "Death"                 ,//死亡
    "DeathPrev"             ,//死亡前 回复生命可阻止死亡
    "SlowUpdate"            ,//慢速刷新 60刷新触发一次
    "Init"                  ,//被创建时
    "IdleStatus"            ,//等待状态 刷新
    "MoveStatus"            ,//移动状态 刷新
    ...CInteractHookList,
] as const;

/**任何角色通用的事件类型  
 * u为角色 n不存在
 */
export type CCharHook = typeof CCharHookList[number];

/**全局的事件列表 */
export const CGlobalHookList = [
    "AvatarUpdate"          ,   //玩家刷新
    "GameBegin"             ,   //每次进入游戏时
    ...CCharHookList
] as const;
/**全局事件 */
export type CGlobalHook = typeof CGlobalHookList[number];


/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect:EocEffect;
    /**排序权重 */
    weight:number;
}

export function buildEventFrame(){
    const em = new EventManager("CNPCEF");
    em.addInvokeID("GameBegin"        ,0,"CNPC_EOC_GameBeginEvent");
    em.addInvokeID("TakeDamage"       ,0,"CNPC_EOC_TakeDamageEvent");
    em.addInvokeID("TryMeleeAttack"   ,0,"CNPC_EOC_TryMeleeAttackEvent");
    em.addInvokeID("SucessMeleeAttack",0,"CNPC_EOC_SucessMeleeAttackEvent");
    em.addInvokeID("MissMeleeAttack"  ,0,"CNPC_EOC_MissMeleeAttackEvent");

    em.addInvokeID("TryRangeAttack"   ,0,"CNPC_EOC_TryRangeAttackEvent");

    em.addInvokeID("TryAttack"        ,0,"CNPC_EOC_TryAttackEvent");
    em.addInvokeID("EnterBattle"      ,0,"CNPC_EOC_EnterBattleEvent");
    em.addInvokeID("DeathPrev"        ,0,"CNPC_EOC_DeathPrevEvent");
    em.addInvokeID("Death"            ,0,"CNPC_EOC_DeathEvent");
    em.addInvokeID("Init"             ,0,"CNPC_EOC_InitEvent");

    em.addInvokeID("AvatarMove"       ,0,"CNPC_EOC_AvatarMoveEvent");
    em.addInvokeID("AvatarUpdate"     ,0,"CNPC_EOC_AvatarUpdateEvent");

    em.addInvokeID("Update"           ,0,"CNPC_EOC_UpdateEvent");
    em.addInvokeID("BattleUpdate"     ,0,"CNPC_EOC_BattleUpdateEvent");
    em.addInvokeID("NonBattleUpdate"  ,0,"CNPC_EOC_NonBattleUpdateEvent");
    em.addInvokeID("SlowUpdate"       ,0,"CNPC_EOC_SlowUpdateEvent");

    em.addInvokeID("MoveStatus"       ,0,"CNPC_EOC_MoveStatusEvent");
    em.addInvokeID("IdleStatus"       ,0,"CNPC_EOC_IdleStatusEvent");
    return em.build();
}