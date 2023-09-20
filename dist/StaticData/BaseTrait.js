"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTrait = exports.BaseBodyOrdering = exports.CnpcBaseBody = exports.CnpcFlag = void 0;
const StaticData_1 = require("./StaticData");
const ModDefine_1 = require("@src/ModDefine");
exports.CnpcFlag = {
    type: "mutation",
    id: (0, ModDefine_1.genMutationID)("CnpcFlag"),
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
exports.BaseTrait = [exports.CnpcFlag, exports.CnpcBaseBody, exports.BaseBodyOrdering];
(0, StaticData_1.saveStaticData)('BaseTrait', exports.BaseTrait);
