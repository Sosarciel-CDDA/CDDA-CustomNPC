import { EocEffect } from "cdda-schema";
import { EventManager } from "./CDDA-Event";



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
    em.addInvoke("GameBegin"        ,0,"CNPC_EOC_GameBeginEvent");
    em.addInvoke("TakeDamage"       ,0,"CNPC_EOC_TakeDamageEvent");
    em.addInvoke("TryMeleeAttack"   ,0,"CNPC_EOC_TryMeleeAttackEvent");
    em.addInvoke("SucessMeleeAttack",0,"CNPC_EOC_SucessMeleeAttackEvent");
    em.addInvoke("MissMeleeAttack"  ,0,"CNPC_EOC_MissMeleeAttackEvent");

    em.addInvoke("TryRangeAttack"   ,0,"CNPC_EOC_TryRangeAttackEvent");

    em.addInvoke("TryAttack"        ,0,"CNPC_EOC_TryAttackEvent");
    em.addInvoke("EnterBattle"      ,0,"CNPC_EOC_EnterBattleEvent");
    em.addInvoke("DeathPrev"        ,0,"CNPC_EOC_DeathPrevEvent");
    em.addInvoke("Death"            ,0,"CNPC_EOC_DeathEvent");
    em.addInvoke("Init"             ,0,"CNPC_EOC_InitEvent");

    em.addInvoke("AvatarMove"       ,0,"CNPC_EOC_AvatarMoveEvent");
    em.addInvoke("AvatarUpdate"     ,0,"CNPC_EOC_AvatarUpdateEvent");

    em.addInvoke("Update"           ,0,"CNPC_EOC_UpdateEvent");
    em.addInvoke("BattleUpdate"     ,0,"CNPC_EOC_BattleUpdateEvent");
    em.addInvoke("NonBattleUpdate"  ,0,"CNPC_EOC_NonBattleUpdateEvent");
    em.addInvoke("SlowUpdate"       ,0,"CNPC_EOC_SlowUpdateEvent");

    em.addInvoke("MoveStatus"       ,0,"CNPC_EOC_MoveStatusEvent");
    em.addInvoke("IdleStatus"       ,0,"CNPC_EOC_IdleStatusEvent");
    return em.build();
}