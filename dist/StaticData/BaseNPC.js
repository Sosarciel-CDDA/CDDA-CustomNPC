"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNpc = void 0;
const StaticData_1 = require("./StaticData");
const CMDefine_1 = require("../CMDefine");
const BaseNpcClass = {
    type: 'npc_class',
    id: CMDefine_1.CMDef.genNpcClassID("BaseNpcClass"),
    name: "BaseNpcClass",
    job_description: "基础NPC职业",
    common: false,
    traits: []
};
const BaseNpcInstance = {
    type: "npc",
    id: CMDefine_1.CMDef.genNpcInstanceID("BaseNpc"),
    class: CMDefine_1.CMDef.genNpcClassID("BaseNpcClass"),
    attitude: 0,
    mission: 0,
    faction: "your_followers",
    chat: "TALK_DONE",
};
exports.BaseNpc = [BaseNpcClass, BaseNpcInstance];
(0, StaticData_1.saveStaticData)(exports.BaseNpc, 'static_resource', 'base_npc');
