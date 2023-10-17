import { EocEffect } from "CddaJsonFormat";



/**Cnpc角色与怪物互动的事件 列表  
 * u为角色 n为怪物
 */
export const CnpcInteractiveEventList = [
    "CnpcCheckTakeDamage"       ,//在 检测法术中检测到 受到 任何伤害
    "CnpcCheckTakeRangeDamage"  ,//在 检测法术中检测到 受到 远程伤害
    "CnpcCheckTakeMeleeDamage"  ,//在 检测法术中检测到 受到 近战伤害
    "CnpcCheckCauseMeleeHit"    ,//近战攻击命中目标 并成功造成伤害
    "CnpcCheckCauseRangeHit"    ,//远程攻击命中目标 并成功造成伤害
    "CnpcCheckCauseHit"         ,//命中目标 并成功造成伤害
] as const;
/**Cnpc角色与怪物互动的事件 */
export type CnpcInteractiveEvent = typeof CnpcInteractiveEventList[number];

/**任何角色通用的事件列表  
 * u为角色 n不存在
 */
export const CommonEventTypeList = [
    "Update"                ,//刷新 Cnpc角色尽量使用 CnpcUpdate
    "TryMeleeHit"           ,//尝试近战攻击
    "TryRangeHit"           ,//尝试远程攻击
    "TryHit"                ,//尝试攻击
    "TakeDamage"            ,//受到伤害
] as const;
/**任何角色通用的事件类型  
 * u为角色 n不存在
 */
export type CommonEventType = typeof CommonEventTypeList[number];

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



/**Cnpc角色的 反转Talker的角色事件列表  
 * 对应同名CauseDamage  
 * n为角色 u为受害者
 */
export const CnpcReverseEventTypeList = [
    "CnpcCheckCauseDamage"       ,//在 检测法术中检测到 造成 任何伤害
    "CnpcCheckCauseMeleeDamage"  ,//在 检测法术中检测到 造成 远程伤害
    "CnpcCheckCauseRangeDamage"  ,//在 检测法术中检测到 造成 近战伤害
] as const;
/**Cnpc角色的 反转Talker的角色事件类型  
 * 对应同名CauseDamage  
 */
export type CnpcReverseEventType = typeof CnpcReverseEventTypeList[number];

/**任何Cnpc角色事件 列表 */
export const AnyCnpcEventTypeList = [...CnpcEventTypeList,...CnpcReverseEventTypeList] as const;
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