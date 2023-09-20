import { MutationID } from "../Mutattion";
import { AnyItemID } from "../Item";
import { FlagID } from "../Flag";
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
    {
        u_has_trait: MutationID;
    },
    "u_can_drop_weapon",
    {
        u_has_wielded_with_flag: FlagID;
    },
    {
        u_has_item: AnyItemID;
    },
    {
        math: [string, "==" | "!=" | ">=" | "<=" | ">" | "<", string];
    },
    BoolOperaCompStr
];
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
