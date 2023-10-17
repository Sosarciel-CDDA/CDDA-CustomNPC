"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEffect = exports.Courage = void 0;
const ModDefine_1 = require("../ModDefine");
const StaticData_1 = require("./StaticData");
/**取消逃跑效果 */
exports.Courage = {
    type: "effect_type",
    id: (0, ModDefine_1.genEffectID)("Courage"),
    name: ["勇气"],
    desc: ["npc不会逃跑"],
    removes_effects: ["npc_run_away"],
};
exports.BaseEffect = [exports.Courage];
(0, StaticData_1.saveStaticData)(exports.BaseEffect, 'static_resource', "base_effect");
