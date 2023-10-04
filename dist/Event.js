"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEvemtTypeList = exports.ReverseCharEvemtTypeList = exports.CharEvemtTypeList = void 0;
/**角色事件列表 */
exports.CharEvemtTypeList = [
    "CharIdle",
    "CharMove",
    "CharCauseHit",
    "CharUpdate",
    "CharCauseMeleeHit",
    "CharCauseRangeHit",
    "CharInit",
    "CharTakeDamage",
    "CharTakeRangeDamage",
    "CharTakeMeleeDamage",
    "CharBattleUpdate",
    "CharDeath", //角色 死亡
];
/**反转Talker的角色事件列表
 * 对应同名CauseDamage
 * npc为角色
 */
exports.ReverseCharEvemtTypeList = [
    "CharCauseDamage",
    "CharCauseMeleeDamage",
    "CharCauseRangeDamage", //u为受害者
];
/**全局事件列表 */
exports.GlobalEvemtTypeList = ["PlayerUpdate", ...exports.CharEvemtTypeList, ...exports.ReverseCharEvemtTypeList];
