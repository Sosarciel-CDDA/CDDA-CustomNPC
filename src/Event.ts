import { EocEffect } from "CddaJsonFormat";

/**角色事件列表 */
export const CharEvemtTypeList = [
    "CharIdle"              ,//角色 等待状态 刷新
    "CharMove"              ,//角色 移动状态 刷新
    "CharCauseHit"          ,//角色 命中目标 并成功造成伤害 u为角色 n为受害者
    "CharUpdate"            ,//角色 刷新
    "CharCauseMeleeHit"     ,//角色 近战攻击命中目标 并成功造成伤害 u为角色 n为受害者
    "CharCauseRangeHit"     ,//角色 远程攻击命中目标 并成功造成伤害 u为角色 n为受害者
    "CharInit"              ,//角色 被创建时
    "CharTakeDamage"        ,//角色 受到任何伤害
    "CharTakeRangeDamage"   ,//角色 受到远程伤害
    "CharTakeMeleeDamage"   ,//角色 受到近战伤害
    "CharBattleUpdate"      ,//角色 进入战斗时 刷新
    "CharDeath"             ,//角色 死亡
] as const;
/**角色事件类型 */
export type CharEventType = typeof CharEvemtTypeList[number];

/**反转Talker的角色事件列表  
 * 对应同名CauseDamage  
 * npc为角色  
 */
export const ReverseCharEvemtTypeList = [
    "CharCauseDamage"       ,//u为受害者
    "CharCauseMeleeDamage"  ,//u为受害者
    "CharCauseRangeDamage"  ,//u为受害者
] as const;
/**反转Talker的角色事件类型  
 * 对应同名CauseDamage  
 */
export type ReverseCharEventType = typeof ReverseCharEvemtTypeList[number];

/**全局事件列表 */
export const GlobalEvemtTypeList = ["PlayerUpdate",...CharEvemtTypeList,...ReverseCharEvemtTypeList] as const;
/**全局事件 */
export type GlobalEventType = typeof GlobalEvemtTypeList[number];


/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect:EocEffect;
    /**排序权重 */
    weight:number;
}