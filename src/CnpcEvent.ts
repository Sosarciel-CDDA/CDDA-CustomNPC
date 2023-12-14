import { EocEffect } from "cdda-schema";



/**任何角色的交互事件 列表  
 * u为角色 n为怪物
 */
export const CNPCCommonInteractiveEventTypeList = [
    "TryMeleeHit"           ,//尝试近战攻击
    "TryRangeHit"           ,//尝试远程攻击
    "TryHit"                ,//尝试攻击
    "CauseMeleeHit"         ,//近战攻击命中
    "MissMeleeHit"          ,//近战攻击未命中
] as const;
/**任何角色的交互事件  
 * u为角色 n为怪物
 */
export type CNPCCommonInteractiveEventType = typeof CNPCCommonEventTypeList[number];

/**任何角色通用的事件 列表  
 * u为角色 n不存在
 */
export const CNPCCommonEventTypeList = [
    "Update"                ,//刷新 Cnpc角色尽量使用 CnpcUpdate
    "TakeDamage"            ,//受到伤害
    "Death"                 ,//死亡
    "EnterBattle"           ,//进入战斗
    "BattleUpdate"          ,//进入战斗时 刷新
    "NonBattleUpdate"       ,//非战斗时 刷新
    ...CNPCCommonInteractiveEventTypeList,
] as const;

/**任何角色通用的事件类型  
 * u为角色 n不存在
 */
export type CNPCCommonEventType = typeof CNPCCommonEventTypeList[number];

/**Cnpc角色事件列表  
 * u为角色 n不存在
 */
export const CNPCEventTypeList = [
    "CnpcIdle"                  ,//等待状态 刷新
    "CnpcMove"                  ,//移动状态 刷新
    "CnpcUpdate"                ,//刷新
    "CnpcUpdateSlow"            ,//慢速刷新 60刷新触发一次
    "CnpcInit"                  ,//被创建时
    "CnpcDeath"                 ,//死亡
    "CnpcDeathPrev"             ,//死亡前 回复生命可阻止死亡
    "CnpcDeathAfter"            ,//死亡后
    ...CNPCCommonEventTypeList      ,
] as const;
/**Cnpc角色事件类型 */
export type CNPCEventType = typeof CNPCEventTypeList[number];

/**全局的事件列表 */
export const CNPCGlobalEventTypeList = [
    "PlayerUpdate"          ,   //玩家刷新
    "GameBegin"             ,   //每次进入游戏时
    ...CNPCEventTypeList
] as const;
/**全局事件 */
export type CNPCGlobalEventType = typeof CNPCGlobalEventTypeList[number];


/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect:EocEffect;
    /**排序权重 */
    weight:number;
}

function buildFrame(){
    
}