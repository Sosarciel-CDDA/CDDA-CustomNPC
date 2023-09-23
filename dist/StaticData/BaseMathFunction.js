"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMathFunction = exports.Log10 = exports.DamageMul = exports.CalcDamage = void 0;
const StaticData_1 = require("./StaticData");
/**属性附加伤害计算
 * (基础伤害+属性加值)*属性倍率
 * function(基础伤害,关键属性)
 */
exports.CalcDamage = {
    type: "jmath_function",
    id: "CalcDamage",
    num_args: 2,
    return: "(_0 + _1) * DamageMul( _1 )",
};
/**伤害倍率增幅
 * function(关键属性)
 */
exports.DamageMul = {
    type: "jmath_function",
    id: "DamageMul",
    num_args: 0,
    return: "Log10( _0 ) * Log10( _0 )",
};
/**log10
 */
exports.Log10 = {
    type: "jmath_function",
    id: "Log10",
    num_args: 1,
    return: "log(_0)/log(10)",
};
exports.BaseMathFunction = [exports.CalcDamage, exports.DamageMul, exports.Log10];
(0, StaticData_1.saveStaticData)("BaseMathFunction", exports.BaseMathFunction);
