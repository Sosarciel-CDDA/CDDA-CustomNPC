import { EocEffect } from "./CddaJsonFormat";
/**角色与怪物互动的事件 列表
 * u为角色 n为怪物
 */
export declare const InteractiveCharEventList: string[];
/**角色与怪物互动的事件 */
export type InteractiveCharEvent = typeof InteractiveCharEventList[number];
/**角色事件列表
 * u为角色 n不存在
 */
export declare const CharEventTypeList: readonly ["CharIdle", "CharMove", "CharUpdate", "CharInit", "CharBattleUpdate", "CharDeath", ...string[]];
/**角色事件类型 */
export type CharEventType = typeof CharEventTypeList[number];
/**反转Talker的角色事件列表
 * 对应同名CauseDamage
 * n为角色 u为受害者
 */
export declare const ReverseCharEventTypeList: readonly ["CharCauseDamage", "CharCauseMeleeDamage", "CharCauseRangeDamage"];
/**反转Talker的角色事件类型
 * 对应同名CauseDamage
 */
export type ReverseCharEventType = typeof ReverseCharEventTypeList[number];
/**任何角色事件 列表 */
export declare const AnyCharEventTypeList: readonly ["CharIdle", "CharMove", "CharUpdate", "CharInit", "CharBattleUpdate", "CharDeath", ...string[], "CharCauseDamage", "CharCauseMeleeDamage", "CharCauseRangeDamage"];
/**任何角色事件 */
export type AnyCharEvenetType = typeof AnyCharEventTypeList[number];
/**全局事件列表 */
export declare const GlobalEvemtTypeList: readonly ["PlayerUpdate", "CharIdle", "CharMove", "CharUpdate", "CharInit", "CharBattleUpdate", "CharDeath", ...string[], "CharCauseDamage", "CharCauseMeleeDamage", "CharCauseRangeDamage"];
/**全局事件 */
export type GlobalEventType = typeof GlobalEvemtTypeList[number];
/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect: EocEffect;
    /**排序权重 */
    weight: number;
};
