import { EocEffect } from "CddaJsonFormat";



/**角色与怪物互动的事件 列表  
 * u为角色 n为怪物
 */
export const InteractiveCharEventList = [
    "CharTakeDamage"        ,//角色 受到任何伤害
    "CharTakeRangeDamage"   ,//角色 受到远程伤害
    "CharTakeMeleeDamage"   ,//角色 受到近战伤害
    "CharCauseMeleeHit"     ,//角色 近战攻击命中目标 并成功造成伤害
    "CharCauseRangeHit"     ,//角色 远程攻击命中目标 并成功造成伤害
    "CharCauseHit"          ,//角色 命中目标 并成功造成伤害
] as const;
/**角色与怪物互动的事件 */
export type InteractiveCharEvent = typeof InteractiveCharEventList[number];


/**角色事件列表  
 * u为角色 n不存在
 */
export const CharEventTypeList = [
    "CharIdle"              ,//角色 等待状态 刷新
    "CharMove"              ,//角色 移动状态 刷新
    "CharUpdate"            ,//角色 刷新
    "CharInit"              ,//角色 被创建时
    "CharBattleUpdate"      ,//角色 进入战斗时 刷新
    "CharDeath"             ,//角色 死亡
    ...InteractiveCharEventList
] as const;
/**角色事件类型 */
export type CharEventType = typeof CharEventTypeList[number];



/**反转Talker的角色事件列表  
 * 对应同名CauseDamage  
 * n为角色 u为受害者
 */
export const ReverseCharEventTypeList = [
    "CharCauseDamage"       ,
    "CharCauseMeleeDamage"  ,
    "CharCauseRangeDamage"  ,
] as const;
/**反转Talker的角色事件类型  
 * 对应同名CauseDamage  
 */
export type ReverseCharEventType = typeof ReverseCharEventTypeList[number];

/**任何角色事件 列表 */
export const AnyCharEventTypeList = [...CharEventTypeList,...ReverseCharEventTypeList] as const;
/**任何角色事件 */
export type AnyCharEvenetType = typeof AnyCharEventTypeList[number];

/**全局事件列表 */
export const GlobalEvemtTypeList = ["PlayerUpdate",...AnyCharEventTypeList] as const;
/**全局事件 */
export type GlobalEventType = typeof GlobalEvemtTypeList[number];


/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect:EocEffect;
    /**排序权重 */
    weight:number;
}