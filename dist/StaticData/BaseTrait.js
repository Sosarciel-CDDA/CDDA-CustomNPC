"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTrait = exports.CnpcFlag = void 0;
const StaticData_1 = require("./StaticData");
const ModDefine_1 = require("../ModDefine");
exports.CnpcFlag = {
    type: "mutation",
    id: (0, ModDefine_1.genMutationID)("CnpcFlag"),
    name: "自定义NPC标识符",
    description: "表示此角色是自定义NPC的NPC,会启用EOC",
    points: 0,
};
exports.BaseTrait = [exports.CnpcFlag];
(0, StaticData_1.saveStaticData)('BaseTrait', exports.BaseTrait);
