"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CMDefine_1 = require("../CMDefine");
const StaticData_1 = require("./StaticData");
/**取消逃跑效果 */
const Courage = {
    type: "effect_type",
    id: CMDefine_1.CMDef.genEffectID("Courage"),
    name: ["勇气"],
    desc: ["npc不会逃跑"],
    removes_effects: ["npc_run_away"],
};
const BaseEffect = [Courage];
(0, StaticData_1.saveStaticData)(BaseEffect, 'static_resource', "base_effect");
