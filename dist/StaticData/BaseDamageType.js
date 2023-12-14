"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDamageType = void 0;
const StaticData_1 = require("./StaticData");
/**近战检测 */
const MeleeCheck = {
    type: "damage_type",
    id: "MeleeCheck",
    name: "近战检测事件辅助伤害",
    no_resist: true,
    ondamage_eocs: ["CNPC_EOC_CheckSucessMeleeAttackEvent"]
};
const MeleeCheckIO = {
    type: "damage_info_order",
    id: MeleeCheck.id
};
/**远程检测 */
const RangeCheck = {
    type: "damage_type",
    id: "RangeCheck",
    name: "远程检测事件辅助伤害",
    no_resist: true,
    ondamage_eocs: ["CNPC_EOC_CheckCauseRangeHitEvent"]
};
const RangeCheckIO = {
    type: "damage_info_order",
    id: RangeCheck.id
};
exports.BaseDamageType = [];
(0, StaticData_1.saveStaticData)(exports.BaseDamageType, 'static_resource', "base_damage_type");
