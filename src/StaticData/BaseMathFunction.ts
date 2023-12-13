import { MathFunction, MathFunctionID } from "cdda-schema";
import { saveStaticData } from "./StaticData";



/**暴击伤害  
 * function(基础伤害,暴击率,暴击伤害)  
 * 暴击伤害为1, 暴击时造成200%伤害  
 */
const CritDamage:MathFunction={
    type:"jmath_function",
    id:"CritDamage" as MathFunctionID,
    num_args: 3,
    return:"_0 + (_0 * (rng(0, 1) < _1 ? _2 : 0))",
}

/**感知系数伤害 */
const PerDamage:MathFunction={
    type:"jmath_function",
    id:"PerDamage" as MathFunctionID,
    num_args: 1,
    return:"CalcDamage(_0 , u_val('perception'))",
}
/**力量系数伤害 */
const StrDamage:MathFunction={
    type:"jmath_function",
    id:"StrDamage" as MathFunctionID,
    num_args: 1,
    return:"CalcDamage(_0 , u_val('strength'))",
}
/**敏捷系数伤害 */
const DexDamage:MathFunction={
    type:"jmath_function",
    id:"DexDamage" as MathFunctionID,
    num_args: 1,
    return:"CalcDamage(_0 , u_val('dexterity'))",
}
/**智力系数伤害 */
const IntDamage:MathFunction={
    type:"jmath_function",
    id:"IntDamage" as MathFunctionID,
    num_args: 1,
    return:"CalcDamage(_0 , u_val('intelligence'))",
}

/**属性伤害计算  
 * (基础伤害+属性加值)*属性倍率  
 * function(基础伤害,关键属性)  
 */
const CalcDamage:MathFunction={
    type:"jmath_function",
    id:"CalcDamage" as MathFunctionID,
    num_args: 2,
    return:"(_0 + _1) * DamageMul( _1 )",
}
/**伤害倍率增幅  
 * function(关键属性)  
 */
const DamageMul:MathFunction={
    type:"jmath_function",
    id:"DamageMul" as MathFunctionID,
    num_args: 1,
    return:"Log10( _0 ) * Log10( _0 )",
}
/**Pow2  
 * function( number )  
 */
const Pow2:MathFunction={
    type:"jmath_function",
    id:"Pow2" as MathFunctionID,
    num_args: 1,
    return:"_0 * _0",
}
/**log10  
 * function( number )  
 */
const Log10:MathFunction={
    type:"jmath_function",
    id:"Log10" as MathFunctionID,
    num_args: 1,
    return:"log(_0)/log(10)",
}
/**经验公式  
 * function( 等级 )  
 */
const LvlExp:MathFunction={
    type:"jmath_function",
    id:"LvlExp" as MathFunctionID,
    num_args: 1,
    return:"100 + (_0 * _0 * 100)",
}

/**血量总和  
 * function()  
 */
const SumHp:MathFunction={
    type:"jmath_function",
    id:"SumHp" as MathFunctionID,
    num_args: 0,
    return:"u_hp('torso') + u_hp('head') + u_hp('leg_l') + u_hp('leg_r') + u_hp('arm_l') + u_hp('arm_r')"
}
/**平均血量  
 * function()  
 */
const AvgHp:MathFunction={
    type:"jmath_function",
    id:"AvgHp" as MathFunctionID,
    num_args: 0,
    return:"SumHp()/6"
}
/**最低血量  
 * function()  
 */
const MinHp:MathFunction={
    type:"jmath_function",
    id:"MinHp" as MathFunctionID,
    num_args: 0,
    return:"min(u_hp('torso') , u_hp('head') , u_hp('leg_l') , u_hp('leg_r') , u_hp('arm_l') , u_hp('arm_r'))"
}
/**最高血量  
 * function()  
 */
const MaxHp:MathFunction={
    type:"jmath_function",
    id:"MaxHp" as MathFunctionID,
    num_args: 0,
    return:"max(u_hp('torso') , u_hp('head') , u_hp('leg_l') , u_hp('leg_r') , u_hp('arm_l') , u_hp('arm_r'))"
}


/**accept a spell level, return the amount of XP spell required at this level. Not used anywhere because of #66728 (comment) */
const SpellExp:MathFunction={
    "type": "jmath_function",
    "id": "SpellExp" as MathFunctionID,
    "num_args": 1,
    "return": "2.71828182^(0.146661*(_0+62.5))-6200"
}
/**accept the spell level, return a difference in experience between spell's current level and the next level */
const SpellExpDiff:MathFunction={
    "type": "jmath_function",
    "id": "SpellExpDiff" as MathFunctionID,
    "num_args": 1,
    "return": "SpellExp(_0 + 1) - SpellExp(_0)"
}

export const BaseMathFunction = [CalcDamage,DamageMul,Log10,Pow2,LvlExp,SpellExpDiff,SpellExp,SumHp,AvgHp,MinHp,MaxHp,
    PerDamage,StrDamage,DexDamage,IntDamage,CritDamage];
saveStaticData(BaseMathFunction,'static_resource',"base_math_function");