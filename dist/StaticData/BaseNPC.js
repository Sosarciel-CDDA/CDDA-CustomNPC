"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNpc = void 0;
const StaticData_1 = require("./StaticData");
const BaseNpcClass = {
    type: 'npc_class',
    id: "CNPC_NPCLASS_BaseNpcClass",
    name: "BaseNpcClass",
    job_description: "基础NPC职业",
    common: false,
    traits: [
        { "trait": "" }
    ]
};
const BaseNpcInstance = {
    type: "npc",
    id: "CNPC_NPC_BaseNpc",
    class: "CNPC_NPCLASS_BaseNpcClass",
    attitude: 0,
    mission: 0,
    faction: "your_followers",
};
exports.BaseNpc = [BaseNpcClass, BaseNpcInstance];
(0, StaticData_1.saveStaticData)('BaseNpc', exports.BaseNpc);
