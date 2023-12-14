import { EocEffect } from "cdda-schema";
import { EventManager } from "./CDDA-Event";



/**任何角色的交互事件 列表  
 * u为角色 n为怪物
 */
export const CCommonInteractiveEventTypeList = [
    "TryMeleeAttack"           ,//尝试近战攻击
    "TryRangeAttack"           ,//尝试远程攻击
    "TryAttack"                ,//尝试攻击
    "SucessMeleeAttack"        ,//近战攻击命中
    "MissMeleeAttack"          ,//近战攻击未命中
] as const;
/**任何角色的交互事件  
 * u为角色 n为怪物
 */
export type CCommonInteractiveEventType = typeof CCommonEventTypeList[number];

/**任何角色通用的事件 列表  
 * u为角色 n不存在
 */
export const CCommonEventTypeList = [
    "Update"                ,//刷新 Cnpc角色尽量使用 CnpcUpdate
    "TakeDamage"            ,//受到伤害
    "EnterBattle"           ,//进入战斗
    "BattleUpdate"          ,//进入战斗时 刷新
    "NonBattleUpdate"       ,//非战斗时 刷新
    "Death"                 ,//死亡
    "DeathPrev"             ,//死亡前 回复生命可阻止死亡
    ...CCommonInteractiveEventTypeList,
] as const;

/**任何角色通用的事件类型  
 * u为角色 n不存在
 */
export type CCommonEventType = typeof CCommonEventTypeList[number];

/**Cnpc角色事件列表  
 * u为角色 n不存在
 */
export const CCnpcEventTypeList = [
    "CnpcIdle"                  ,//等待状态 刷新
    "CnpcMove"                  ,//移动状态 刷新
    "CnpcUpdate"                ,//刷新
    "CnpcUpdateSlow"            ,//慢速刷新 60刷新触发一次
    "CnpcInit"                  ,//被创建时
    ...CCommonEventTypeList      ,
] as const;
/**Cnpc角色事件类型 */
export type CCnpcEventType = typeof CCnpcEventTypeList[number];

/**全局的事件列表 */
export const CGlobalEventTypeList = [
    "PlayerUpdate"          ,   //玩家刷新
    "GameBegin"             ,   //每次进入游戏时
    ...CCnpcEventTypeList
] as const;
/**全局事件 */
export type CGlobalEventType = typeof CGlobalEventTypeList[number];


/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect:EocEffect;
    /**排序权重 */
    weight:number;
}

async function buildEventFrame(){
    const em = new EventManager("CNPCEF");
    em.addInvoke("GameBegin"    ,0,"CNPC_EOC_EGB");
    em.addInvoke("TakeDamage"   ,0,"CNPC_EOC_CommonTakeDamageEvent");
    em.addInvoke("MeleeAttack"  ,0,"CNPC_EOC_CommonMeleeHitEvent");
    em.addInvoke("RangeAttack"  ,0,"CNPC_EOC_CommonRangeHitEvent");
    em.addInvoke("AvaterMove"   ,0,"CNPC_EOC_EPM");
    em.addInvoke("Update"       ,0,"CNPC_EOC_EGU");
    return em.build();
}