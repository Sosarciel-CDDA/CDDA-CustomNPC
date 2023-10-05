"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEvemtTypeList = exports.AnyCharEventTypeList = exports.ReverseCharEventTypeList = exports.CharEventTypeList = exports.InteractiveCharEventList = void 0;
/**角色与怪物互动的事件 列表
 * u为角色 n为怪物
 */
exports.InteractiveCharEventList = [
    "CharTakeDamage",
    "CharTakeRangeDamage",
    "CharTakeMeleeDamage",
    "CharCauseMeleeHit",
    "CharCauseRangeHit",
    "CharCauseHit", //角色 命中目标 并成功造成伤害
];
/**角色事件列表
 * u为角色 n不存在
 */
exports.CharEventTypeList = [
    "CharIdle",
    "CharMove",
    "CharUpdate",
    "CharInit",
    "CharBattleUpdate",
    "CharDeath",
    ...exports.InteractiveCharEventList
];
/**反转Talker的角色事件列表
 * 对应同名CauseDamage
 * n为角色 u为受害者
 */
exports.ReverseCharEventTypeList = [
    "CharCauseDamage",
    "CharCauseMeleeDamage",
    "CharCauseRangeDamage",
];
/**任何角色事件 列表 */
exports.AnyCharEventTypeList = [...exports.CharEventTypeList, ...exports.ReverseCharEventTypeList];
/**全局事件列表 */
exports.GlobalEvemtTypeList = ["PlayerUpdate", ...exports.AnyCharEventTypeList];
