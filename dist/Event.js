"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEventTypeList = exports.AnyCnpcEventTypeList = exports.CnpcReverseEventTypeList = exports.CnpcEventTypeList = exports.CommonEventTypeList = exports.CnpcInteractiveEventList = void 0;
/**Cnpc角色与怪物互动的事件 列表
 * u为角色 n为怪物
 */
exports.CnpcInteractiveEventList = [
    "CnpcCheckTakeDamage",
    "CnpcCheckTakeRangeDamage",
    "CnpcCheckTakeMeleeDamage",
    "CnpcCheckCauseMeleeHit",
    "CnpcCheckCauseRangeHit",
    "CnpcCheckCauseHit", //命中目标 并成功造成伤害
];
/**任何角色通用的事件列表
 * u为角色 n不存在
 */
exports.CommonEventTypeList = [
//"TryMeleeHit"           ,//尝试近战攻击
//"TryRangeHit"           ,//尝试远程攻击
//"TryHit"                ,//尝试攻击
];
/**Cnpc角色事件列表
 * u为角色 n不存在
 */
exports.CnpcEventTypeList = [
    "CnpcIdle",
    "CnpcMove",
    "CnpcUpdate",
    "CnpcUpdateSlow",
    "CnpcInit",
    "CnpcBattleUpdate",
    "CnpcNonBattleUpdate",
    "CnpcDeath",
    "CnpcDeathPrev",
    "CnpcDeathAfter",
    "CnpcEnterBattle",
    "CnpcTryMeleeHit",
    "CnpcTryRangeHit",
    "CnpcTryHit",
    ...exports.CommonEventTypeList,
    ...exports.CnpcInteractiveEventList,
];
/**Cnpc角色的 反转Talker的角色事件列表
 * 对应同名CauseDamage
 * n为角色 u为受害者
 */
exports.CnpcReverseEventTypeList = [
    "CnpcCheckCauseDamage",
    "CnpcCheckCauseMeleeDamage",
    "CnpcCheckCauseRangeDamage", //在 检测法术中检测到 造成 近战伤害
];
/**任何Cnpc角色事件 列表 */
exports.AnyCnpcEventTypeList = [...exports.CnpcEventTypeList, ...exports.CnpcReverseEventTypeList];
/**全局的事件列表 */
exports.GlobalEventTypeList = [
    "PlayerUpdate",
    "GameBegin",
    ...exports.AnyCnpcEventTypeList
];
