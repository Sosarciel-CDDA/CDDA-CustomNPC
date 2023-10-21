"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMathFunction = void 0;
const StaticData_1 = require("./StaticData");
/**属性附加伤害计算
 * (基础伤害+属性加值)*属性倍率
 * function(基础伤害,关键属性)
 */
const CalcDamage = {
    type: "jmath_function",
    id: "CalcDamage",
    num_args: 2,
    return: "(_0 + _1) * DamageMul( _1 )",
};
/**伤害倍率增幅
 * function(关键属性)
 */
const DamageMul = {
    type: "jmath_function",
    id: "DamageMul",
    num_args: 1,
    return: "Log10( _0 ) * Log10( _0 )",
};
/**Pow2
 * function( number )
 */
const Pow2 = {
    type: "jmath_function",
    id: "Pow2",
    num_args: 1,
    return: "_0 * _0",
};
/**log10
 * function( number )
 */
const Log10 = {
    type: "jmath_function",
    id: "Log10",
    num_args: 1,
    return: "log(_0)/log(10)",
};
/**经验公式
 * function( 等级 )
 */
const LvlExp = {
    type: "jmath_function",
    id: "LvlExp",
    num_args: 1,
    return: "100 + (_0 * _0 * 100)",
};
/**血量总和
 * function()
 */
const SumHp = {
    type: "jmath_function",
    id: "SumHp",
    num_args: 0,
    return: "u_hp('torso') + u_hp('head') + u_hp('leg_l') + u_hp('leg_r') + u_hp('arm_l') + u_hp('arm_r')"
};
/**平均血量
 * function()
 */
const AvgHp = {
    type: "jmath_function",
    id: "AvgHp",
    num_args: 0,
    return: "SumHp()/6"
};
/**最低血量
 * function()
 */
const MinHp = {
    type: "jmath_function",
    id: "MinHp",
    num_args: 0,
    return: "min(u_hp('torso') , u_hp('head') , u_hp('leg_l') , u_hp('leg_r') , u_hp('arm_l') , u_hp('arm_r'))"
};
/**最高血量
 * function()
 */
const MaxHp = {
    type: "jmath_function",
    id: "MaxHp",
    num_args: 0,
    return: "max(u_hp('torso') , u_hp('head') , u_hp('leg_l') , u_hp('leg_r') , u_hp('arm_l') , u_hp('arm_r'))"
};
/**accept a spell level, return the amount of XP spell required at this level. Not used anywhere because of #66728 (comment) */
const SpellExp = {
    "type": "jmath_function",
    "id": "SpellExp",
    "num_args": 1,
    "return": "2.71828182^(0.146661*(_0+62.5))-6200"
};
/**accept the spell level, return a difference in experience between spell's current level and the next level */
const SpellExpDiff = {
    "type": "jmath_function",
    "id": "SpellExpDiff",
    "num_args": 1,
    "return": "SpellExp(_0 + 1) - SpellExp(_0)"
};
exports.BaseMathFunction = [CalcDamage, DamageMul, Log10, Pow2, LvlExp, SpellExpDiff, SpellExp, SumHp, AvgHp, MinHp, MaxHp];
(0, StaticData_1.saveStaticData)(exports.BaseMathFunction, 'static_resource', "base_math_function");
