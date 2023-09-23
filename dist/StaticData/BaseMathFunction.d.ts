import { MathFunction } from "../CddaJsonFormat";
/**属性附加伤害计算
 * (基础伤害+属性加值)*属性倍率
 * function(基础伤害,关键属性)
 */
export declare const CalcDamage: MathFunction;
/**伤害倍率增幅
 * function(关键属性)
 */
export declare const DamageMul: MathFunction;
/**log10
 */
export declare const Log10: MathFunction;
export declare const BaseMathFunction: MathFunction[];
