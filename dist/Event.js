"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEventTypeList = exports.AnyCnpcEventTypeList = exports.CnpcEventTypeList = exports.CnpcInteractiveEventList = exports.CommonEventTypeList = exports.CommonInteractiveEventTypeList = void 0;
/**任何角色的交互事件 列表
 * u为角色 n为怪物
 */
exports.CommonInteractiveEventTypeList = [
    "TryMeleeHit",
    "TryRangeHit",
    "TryHit",
    "CauseMeleeHit",
    "MissMeleeHit", //近战攻击未命中
];
/**任何角色通用的事件 列表
 * u为角色 n不存在
 */
exports.CommonEventTypeList = [
    "Update",
    "TakeDamage",
    "Death",
    ...exports.CommonInteractiveEventTypeList,
];
/**Cnpc角色与怪物互动的事件 列表
 * u为角色 n为怪物
 */
exports.CnpcInteractiveEventList = [
    "CnpcTryMeleeHit",
    "CnpcTryRangeHit",
    "CnpcTryHit",
    ...exports.CommonInteractiveEventTypeList,
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
/**任何Cnpc角色事件 列表 */
exports.AnyCnpcEventTypeList = [...exports.CnpcEventTypeList];
/**全局的事件列表 */
exports.GlobalEventTypeList = [
    "PlayerUpdate",
    "GameBegin",
    ...exports.AnyCnpcEventTypeList
];
