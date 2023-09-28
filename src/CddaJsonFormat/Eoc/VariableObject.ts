import { MutationID } from "../Mutattion";
import { AnyItemID } from "../Item";
import { FlagID } from "../Flag";
import { EffectID } from "../Effect";
import { BodyPartID } from "../GenericDefine";
import { TalkerVar } from "./Eoc";





/**数字对象 */
export type NumObj = NumOperateList[number];
/**Eoc数字对象操作符 */
export type NumOperateList = [
    GenericObjOperateList[number]       ,//
    number                              ,//
    {math:[string]}                     ,//
]
/**npc属性技能专用的数字对象 */
export type NpcNumObj = NpcNumOperateList[number];
/**npc属性技能专用的数字对象操作符 */
export type NpcNumOperateList = [
    NumOperaRng                         ,// >=[0] ~ <=[1] 之间的随机数
    NumOperaOneIn                       ,//表示在 [0] 次尝试中出现 1 次的随机确定机会为 1，否则为 0。
    NumOperaDice                        ,//表示通过将 [0] 个随机确定的数字与 1 到 [1] 之间的值相加而生成的随机确定的数字
    NumOperaSum                         ,//所有数字加
    NumOperaMul                         ,//所有数字乘
    {constant: number}                  ,//常量
];

export type NumOperaRng     = {rng: [ NpcNumObj, NpcNumObj ] };
export type NumOperaOneIn   = {one_in: NpcNumObj };
export type NumOperaDice    = {dice: [ NpcNumObj, NpcNumObj ] };
export type NumOperaSum     = {sum: NpcNumObj[] };
export type NumOperaMul     = {mul: NpcNumObj[] };




/**Eoc条件对象 */
export type BoolObj = BoolOperateList[number];
/**Eoc条件对象操作符 */
export type BoolOperateList = [
    BoolOperaNot                                        ,//非
    BoolOperaOr                                         ,//或
    BoolOperaAnd                                        ,//与
    BoolOperaCompStr                                    ,//比较两个字符串
    {math:[string,"=="|"!="|">="|"<="|">"|"<",string]}  ,//
    HasWieldFlag                                        ,//手中的物品有某个flag
    HasItem                                             ,//携带/穿戴/持握/背包里有某个物品
    HasTrait                                            ,//有某个变异
    HasEffect                                           ,//有某个效果
    OneInChance                                         ,//1/n的概率返回true
    NoParamCond                                         ,//无参条件
];
/**无参条件 */
export type NoParamCond = [
    "u_female"              ,// alpha 是女性
    "u_male"                ,// alpha 是男性
    "npc_female"            ,// beta 是女性
    "npc_male"              ,// beta 是男性
    "u_can_drop_weapon"     ,// 可以丢弃手中的物品
][number];

/**有某个效果 */
export type HasEffect = TalkerVar<{
    /**有某个效果
     * 武术static_buffs可以通过形式来检查mabuff:buff_id
     */
    has_effect:EffectID|StrObj;
    /**要求的效果强度 */
    intensity?: NumObj;
    /**检查哪个肢体 */
    bodypart?: BodyPartID;
},"has_effect">;

/**携带/穿戴/持握/背包里有某个物品 */
export type HasItem  = TalkerVar<{
    /**携带/穿戴/持握/背包里有某个物品 */
    has_item:AnyItemID|StrObj;
},"has_item">;;

/**有某个变异 */
export type HasTrait = TalkerVar<{
    /**有某个变异 */
    has_trait:MutationID|StrObj;
},"has_trait">;

/**手中的物品有某个flag */
export type HasWieldFlag = TalkerVar<{
    /**手中的物品有某个flag */
    has_wielded_with_flag:FlagID|StrObj;
},"has_wielded_with_flag">;

/**1/n的概率返回true */
export type OneInChance = {
    /**1/n的概率返回true */
    one_in_chance: NumObj
}

export type BoolOperaNot     = {not:BoolObj};
export type BoolOperaOr      = {or:BoolObj[]};
export type BoolOperaAnd     = {and:BoolObj[]};
export type BoolOperaCompStr = {compare_string: [AnyObj,AnyObj]};





/**Eoc字符串对象 */
export type StrObj = StrOperateList[number];
/**Eoc字符串对象操作符 */
export type StrOperateList = [
    GenericObj                          ,//
    string                              ,
    LocObj                              ,//
]

/**任何Obj */
export type AnyObj = AnyObjOperateList[number];
/**任何Obj操作符 */
export type AnyObjOperateList = [
    BoolObj                 ,//
    StrObj                  ,//
    NumObj                  ,//
]

/**通用Obj操作符 */
export type GenericObjOperateList = [
    { global_val: string  } ,//全局变量
    { u_val: string }       ,//alpha talker的变量
    { npc_val: string }     ,//beta talker的变量
    { context_val: string } ,//上下文变量 存于对话中的变量
    { var_val : string }    ,//获得某个个上下文变量的值 然后以值作为 全局/角色变量名 获得全局/角色值
];
/**通用Obj操作符 */
export type GenericObj = GenericObjOperateList[number];

/**位置Obj */
export type LocObj = GenericObj;
