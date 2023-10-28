import { EocEffect } from "CddaJsonFormat";



/**任何角色的交互事件 列表  
 * u为角色 n为怪物
 */
export const CommonInteractiveEventTypeList = [
    "TryMeleeHit"           ,//尝试近战攻击
    "TryRangeHit"           ,//尝试远程攻击
    "TryHit"                ,//尝试攻击
    "CauseMeleeHit"         ,//近战攻击命中
    "MissMeleeHit"          ,//近战攻击未命中
] as const;
/**任何角色的交互事件  
 * u为角色 n为怪物
 */
export type CommonInteractiveEventType = typeof CommonEventTypeList[number];

/**任何角色通用的事件 列表  
 * u为角色 n不存在
 */
export const CommonEventTypeList = [
    "Update"                ,//刷新 Cnpc角色尽量使用 CnpcUpdate
    "TakeDamage"            ,//受到伤害
    "Death"                 ,//死亡
    ...CommonInteractiveEventTypeList,
] as const;

/**任何角色通用的事件类型  
 * u为角色 n不存在
 */
export type CommonEventType = typeof CommonEventTypeList[number];

/**Cnpc角色与怪物互动的事件 列表  
 * u为角色 n为怪物
 */
export const CnpcInteractiveEventList = [
    "CnpcTryMeleeHit"           ,//Cnpc角色 尝试近战攻击    会创建法术标靶
    "CnpcTryRangeHit"           ,//Cnpc角色 尝试远程攻击    会创建法术标靶
    "CnpcTryHit"                ,//Cnpc角色 尝试攻击        会创建法术标靶
    ...CommonInteractiveEventTypeList,
] as const;
/**Cnpc角色与怪物互动的事件 */
export type CnpcInteractiveEvent = typeof CnpcInteractiveEventList[number];



/**Cnpc角色事件列表  
 * u为角色 n不存在
 */
export const CnpcEventTypeList = [
    "CnpcIdle"                  ,//等待状态 刷新
    "CnpcMove"                  ,//移动状态 刷新
    "CnpcUpdate"                ,//刷新
    "CnpcUpdateSlow"            ,//慢速刷新 60刷新触发一次
    "CnpcInit"                  ,//被创建时
    "CnpcBattleUpdate"          ,//进入战斗时 刷新
    "CnpcNonBattleUpdate"       ,//非战斗时 刷新
    "CnpcDeath"                 ,//死亡
    "CnpcDeathPrev"             ,//死亡前 回复生命可阻止死亡
    "CnpcDeathAfter"            ,//死亡后
    "CnpcEnterBattle"           ,//进入战斗
    ...CommonEventTypeList      ,
    ...CnpcInteractiveEventList ,
] as const;
/**Cnpc角色事件类型 */
export type CnpcEventType = typeof CnpcEventTypeList[number];


/**任何Cnpc角色事件 列表 */
export const AnyCnpcEventTypeList = [...CnpcEventTypeList] as const;
/**任何Cnpc角色事件 */
export type AnyCnpcEvenetType = typeof AnyCnpcEventTypeList[number];

/**全局的事件列表 */
export const GlobalEventTypeList = [
    "PlayerUpdate"          ,   //玩家刷新
    "GameBegin"             ,   //每次进入游戏时
    ...AnyCnpcEventTypeList
] as const;
/**全局事件 */
export type GlobalEventType = typeof GlobalEventTypeList[number];


/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect:EocEffect;
    /**排序权重 */
    weight:number;
}