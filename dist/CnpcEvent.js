"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGlobalEventTypeList = exports.CCnpcEventTypeList = exports.CCommonEventTypeList = exports.CCommonInteractiveEventTypeList = void 0;
const CDDA_Event_1 = require("./CDDA-Event");
/**任何角色的交互事件 列表
 * u为角色 n为怪物
 */
exports.CCommonInteractiveEventTypeList = [
    "TryMeleeHit", //尝试近战攻击
    "TryRangeHit", //尝试远程攻击
    "TryHit", //尝试攻击
    "CauseMeleeHit", //近战攻击命中
    "MissMeleeHit", //近战攻击未命中
];
/**任何角色通用的事件 列表
 * u为角色 n不存在
 */
exports.CCommonEventTypeList = [
    "Update", //刷新 Cnpc角色尽量使用 CnpcUpdate
    "TakeDamage", //受到伤害
    "Death", //死亡
    "EnterBattle", //进入战斗
    "BattleUpdate", //进入战斗时 刷新
    "NonBattleUpdate", //非战斗时 刷新
    "Death", //死亡
    "DeathPrev", //死亡前 回复生命可阻止死亡
    ...exports.CCommonInteractiveEventTypeList,
];
/**Cnpc角色事件列表
 * u为角色 n不存在
 */
exports.CCnpcEventTypeList = [
    "CnpcIdle", //等待状态 刷新
    "CnpcMove", //移动状态 刷新
    "CnpcUpdate", //刷新
    "CnpcUpdateSlow", //慢速刷新 60刷新触发一次
    "CnpcInit", //被创建时
    ...exports.CCommonEventTypeList,
];
/**全局的事件列表 */
exports.CGlobalEventTypeList = [
    "PlayerUpdate", //玩家刷新
    "GameBegin", //每次进入游戏时
    ...exports.CCnpcEventTypeList
];
async function buildEventFrame() {
    const em = new CDDA_Event_1.EventManager("CNPCEF");
    em.addInvoke("GameBegin", 0, "CNPC_EOC_EGB");
    em.addInvoke("TakeDamage", 0, "CNPC_EOC_CommonTakeDamageEvent");
    em.addInvoke("MeleeAttack", 0, "CNPC_EOC_CommonMeleeHitEvent");
    em.addInvoke("RangeAttack", 0, "CNPC_EOC_CommonRangeHitEvent");
    em.addInvoke("AvaterMove", 0, "CNPC_EOC_EPM");
    em.addInvoke("Update", 0, "CNPC_EOC_EGU");
    return em.build();
}
