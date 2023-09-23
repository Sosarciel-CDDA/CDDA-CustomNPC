import { MutationID } from "../Mutattion";
import { AnyItemID } from "../Item";
import { FlagID } from "../Flag";
import { EffectID } from "../Effect";
import { BodyPartID } from "../GenericDefine";
/**数字对象 */
export type NumObj = NumOperateList[number];
/**Eoc数字对象操作符 */
export type NumOperateList = [
    GenericObjOperateList[number],
    number,
    {
        math: [string];
    },
    NumOperaRng,
    NumOperaOneIn,
    NumOperaDice,
    NumOperaSum,
    NumOperaMul,
    {
        constant: number;
    }
];
export type NumOperaRng = {
    rng: [NumObj, NumObj];
};
export type NumOperaOneIn = {
    one_in: NumObj;
};
export type NumOperaDice = {
    dice: [NumObj, NumObj];
};
export type NumOperaSum = {
    sum: NumObj[];
};
export type NumOperaMul = {
    mul: NumObj[];
};
/**Eoc条件对象 */
export type BoolObj = BoolOperateList[number];
/**Eoc条件对象操作符 */
export type BoolOperateList = [
    BoolOperaNot,
    BoolOperaOr,
    BoolOperaAnd,
    BoolOperaCompStr,
    "u_can_drop_weapon",
    {
        math: [string, "==" | "!=" | ">=" | "<=" | ">" | "<", string];
    },
    HasWieldFlag,
    HasItem,
    HasTrait,
    HasEffect
];
/**有某个效果 */
export type HasEffect = {
    /**有某个效果
     * 武术static_buffs可以通过形式来检查mabuff:buff_id
     */
    u_has_effect: EffectID | StrObj;
    /**要求的效果强度 */
    intensity?: NumObj;
    /**检查哪个肢体 */
    bodypart?: BodyPartID;
};
/**携带/穿戴/持握/背包里有某个物品 */
export type HasItem = {
    /**携带/穿戴/持握/背包里有某个物品 */
    u_has_item: AnyItemID | StrObj;
};
/**有某个变异 */
export type HasTrait = {
    /**有某个变异 */
    u_has_trait: MutationID | StrObj;
};
/**手中的物品有某个flag */
export type HasWieldFlag = {
    /**手中的物品有某个flag */
    u_has_wielded_with_flag: FlagID | StrObj;
};
export type BoolOperaNot = {
    not: BoolObj;
};
export type BoolOperaOr = {
    or: BoolObj[];
};
export type BoolOperaAnd = {
    and: BoolObj[];
};
export type BoolOperaCompStr = {
    compare_string: [AnyObj, AnyObj];
};
/**Eoc字符串对象 */
export type StrObj = StrOperateList[number];
/**Eoc字符串对象操作符 */
export type StrOperateList = [
    GenericObjOperateList[number],
    string
];
/**任何Obj */
export type AnyObj = AnyObjOperateList[number];
/**任何Obj操作符 */
export type AnyObjOperateList = [
    BoolObj,
    StrObj,
    NumObj
];
/**通用Obj操作符 */
export type GenericObjOperateList = [
    {
        global_val: string;
    },
    {
        u_val: string;
    }
];
