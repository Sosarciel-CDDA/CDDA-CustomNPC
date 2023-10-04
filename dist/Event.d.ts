import { EocEffect } from "./CddaJsonFormat";
/**角色事件列表 */
export declare const CharEvemtTypeList: readonly ["CharIdle", "CharMove", "CharCauseHit", "CharUpdate", "CharCauseMeleeHit", "CharCauseRangeHit", "CharInit", "CharTakeDamage", "CharTakeRangeDamage", "CharTakeMeleeDamage", "CharBattleUpdate", "CharDeath"];
/**角色事件类型 */
export type CharEventType = typeof CharEvemtTypeList[number];
/**反转Talker的角色事件列表
 * 对应同名CauseDamage
 * npc为角色
 */
export declare const ReverseCharEvemtTypeList: readonly ["CharCauseDamage", "CharCauseMeleeDamage", "CharCauseRangeDamage"];
/**反转Talker的角色事件类型
 * 对应同名CauseDamage
 */
export type ReverseCharEventType = typeof ReverseCharEvemtTypeList[number];
/**全局事件列表 */
export declare const GlobalEvemtTypeList: readonly ["PlayerUpdate", "CharIdle", "CharMove", "CharCauseHit", "CharUpdate", "CharCauseMeleeHit", "CharCauseRangeHit", "CharInit", "CharTakeDamage", "CharTakeRangeDamage", "CharTakeMeleeDamage", "CharBattleUpdate", "CharDeath", "CharCauseDamage", "CharCauseMeleeDamage", "CharCauseRangeDamage"];
/**全局事件 */
export type GlobalEventType = typeof GlobalEvemtTypeList[number];
/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect: EocEffect;
    /**排序权重 */
    weight: number;
};
