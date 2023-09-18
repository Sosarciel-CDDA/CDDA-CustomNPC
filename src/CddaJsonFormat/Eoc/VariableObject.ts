import { MutationID } from "../Mutattion";
import { AnyItemID } from "../Item";
import { FlagID } from "../Flag";





/**数字对象 */
export type NumObj = NumOperateList[number];
/**Eoc数字对象操作符 */
export type NumOperateList = [
    GenericObjOperateList[number]       ,//
    number                              ,//
    {math:[string]}                     ,//
]




/**Eoc条件对象 */
export type BoolObj = BoolOperateList[number];
/**Eoc条件对象操作符 */
export type BoolOperateList = [
    {not:BoolObj}                                       ,//非
    {or:BoolObj[]}                                      ,//或
    {and:BoolObj[]}                                     ,//与
    {u_has_trait:MutationID}                            ,//有某个变异
    "u_can_drop_weapon"                                 ,//可以丢弃手中的物品
    {u_has_wielded_with_flag:FlagID}                    ,//手中的物品有某个flag
    {u_has_item:AnyItemID}                              ,//携带/穿戴/持握/背包里有某个物品
    {math:[string,"=="|"!="|">="|"<="|">"|"<",string]}  ,//
    {compare_string: [AnyObj,AnyObj]}                   ,//比较两个字符串
]

/**Eoc字符串对象 */
export type StrObj = StrOperateList[number];
/**Eoc字符串对象操作符 */
export type StrOperateList = [
    GenericObjOperateList[number]       ,//
    string                              ,
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
    { u_val: string }       ,//自身变量
]

