"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTrait = exports.STAT_MOD_MUTID = exports.NO_ANIM = exports.BaseBodyOrdering = exports.CnpcBaseBody = exports.CnpcFlagMut = exports.CNPC_FLAG = void 0;
const StaticData_1 = require("./StaticData");
const ModDefine_1 = require("../ModDefine");
const BaseEnch_1 = require("./BaseEnch");
/**标记此npc是cnpc的npc */
exports.CNPC_FLAG = (0, ModDefine_1.genMutationID)("CnpcFlag");
exports.CnpcFlagMut = {
    type: "mutation",
    id: exports.CNPC_FLAG,
    name: "自定义NPC标识符",
    description: "表示此角色是自定义NPC的NPC,会启用EOC",
    purifiable: false,
    valid: false,
    player_display: false,
    points: 0,
};
exports.CnpcBaseBody = {
    type: "mutation",
    id: (0, ModDefine_1.genMutationID)("BaseBody"),
    name: "自定义NPC替代素体",
    description: "代替原素体的贴图变异",
    purifiable: false,
    valid: false,
    player_display: false,
    points: 0,
};
//调整素体变异层级到最低
exports.BaseBodyOrdering = {
    type: "overlay_order",
    overlay_ordering: [
        { id: [(0, ModDefine_1.genMutationID)("BaseBody")], order: 0 }
    ]
};
/**无动画变异ID */
exports.NO_ANIM = (0, ModDefine_1.genMutationID)("NoAnim");
const NoAnim = {
    type: "mutation",
    id: exports.NO_ANIM,
    name: "无动画标识符",
    description: "表示此角色没有动画",
    purifiable: false,
    valid: false,
    player_display: false,
    points: 0,
};
/**属性增强变异 */
exports.STAT_MOD_MUTID = (0, ModDefine_1.genMutationID)("StatMod");
const StatMod = {
    type: "mutation",
    id: exports.STAT_MOD_MUTID,
    name: "属性强化",
    description: "使力量提供额外的近战伤害倍率, 感知提供远程伤害加值与倍率, 敏捷提供速度倍率。",
    purifiable: false,
    valid: false,
    player_display: false,
    points: 0,
    enchantments: [BaseEnch_1.STAT_MOD_ENCHID],
};
exports.BaseTrait = [exports.CnpcFlagMut, exports.CnpcBaseBody, exports.BaseBodyOrdering, NoAnim, StatMod];
(0, StaticData_1.saveStaticData)(exports.BaseTrait, 'static_resource', 'base_trait');
