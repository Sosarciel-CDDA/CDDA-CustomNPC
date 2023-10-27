"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEventTypeList = exports.AnyCnpcEventTypeList = exports.CnpcReverseEventTypeList = exports.CnpcEventTypeList = exports.CommonEventTypeList = exports.CnpcInteractiveEventList = void 0;
/**Cnpc角色与怪物互动的事件 列表
 * u为角色 n为怪物
 */
exports.CnpcInteractiveEventList = [
    "CnpcCheckCauseMeleeHit",
    "CnpcCheckCauseRangeHit",
    "CnpcCheckCauseHit", //命中目标 并成功造成伤害
];
/**任何角色通用的事件列表
 * u为角色 n不存在
 */
exports.CommonEventTypeList = [
    "Update",
    "TryMeleeHit",
    "TryRangeHit",
    "TryHit",
    "TakeDamage",
    "CauseMeleeHit",
    "MissMeleeHit", //近战攻击未命中
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
    ...exports.CommonEventTypeList,
    ...exports.CnpcInteractiveEventList,
];
/**Cnpc角色的 反转Talker的角色事件列表
 * 对应同名CauseDamage
 * n为角色 u为受害者
 */
exports.CnpcReverseEventTypeList = [
    "CnpcCheckTakeHit",
    "CnpcCheckTakeMeleeHit",
    "CnpcCheckTakeRangeHit", //在 检测法术中检测到 造成 近战伤害
];
/**任何Cnpc角色事件 列表 */
exports.AnyCnpcEventTypeList = [...exports.CnpcEventTypeList, ...exports.CnpcReverseEventTypeList];
/**全局的事件列表 */
exports.GlobalEventTypeList = [
    "PlayerUpdate",
    "GameBegin",
    ...exports.AnyCnpcEventTypeList
];
