"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEventTypeList = exports.CnpcEventTypeList = exports.CommonEventTypeList = exports.CommonInteractiveEventTypeList = void 0;
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
    "EnterBattle",
    "BattleUpdate",
    "NonBattleUpdate",
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
    "CnpcDeath",
    "CnpcDeathPrev",
    "CnpcDeathAfter",
    ...exports.CommonEventTypeList,
];
/**全局的事件列表 */
exports.GlobalEventTypeList = [
    "PlayerUpdate",
    "GameBegin",
    ...exports.CnpcEventTypeList
];
