import { MathFunction, MathFunctionID } from "CddaJsonFormat";
import { saveStaticData } from "./StaticData";


/**属性附加伤害计算  
 * (基础伤害+属性加值)*属性倍率  
 * function(基础伤害,关键属性)  
 */
export const CalcDamage:MathFunction={
    type:"jmath_function",
    id:"CalcDamage" as MathFunctionID,
    num_args: 2,
    return:"(_0 + _1) * DamageMul( _1 )",
}
/**伤害倍率增幅  
 * function(关键属性)  
 */
export const DamageMul:MathFunction={
    type:"jmath_function",
    id:"DamageMul" as MathFunctionID,
    num_args: 1,
    return:"Log10( _0 ) * Log10( _0 )",
}
/**log10  
 * function( number )  
 */
export const Log10:MathFunction={
    type:"jmath_function",
    id:"Log10" as MathFunctionID,
    num_args: 1,
    return:"log(_0)/log(10)",
}
/**经验公式  
 * function( 等级 )  
 */
export const LvlExp:MathFunction={
    type:"jmath_function",
    id:"LvlExp" as MathFunctionID,
    num_args: 1,
    return:"100 + (_0 * _0 * 100)",
}

export const BaseMathFunction = [CalcDamage,DamageMul,Log10,LvlExp];
saveStaticData("BaseMathFunction",BaseMathFunction);