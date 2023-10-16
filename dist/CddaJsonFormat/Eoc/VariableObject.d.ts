import { MutationID } from "../Mutation";
import { AnyItemID } from "../Item";
import { FlagID } from "../Flag";
import { EffectID } from "../Effect";
import { BodyPartID } from "../GenericDefine";
import { TalkerVar } from "./Eoc";
import { WeaponCategoryID } from "../WeaponCategory";
/**数字对象 */
export type NumObj = NumOperateList[number];
/**Eoc数字对象操作符 */
export type NumOperateList = [
    GenericObjOperateList[number],
    number,
    NumMathExp
];
/**npc属性技能专用的数字对象 */
export type NpcNumObj = NpcNumOperateList[number];
/**npc属性技能专用的数字对象操作符 */
export type NpcNumOperateList = [
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
    rng: [NpcNumObj, NpcNumObj];
};
export type NumOperaOneIn = {
    one_in: NpcNumObj;
};
export type NumOperaDice = {
    dice: [NpcNumObj, NpcNumObj];
};
export type NumOperaSum = {
    sum: NpcNumObj[];
};
export type NumOperaMul = {
    mul: NpcNumObj[];
};
/**Math数字表达式 */
export type NumMathExp = {
    math: [string];
};
/**Eoc条件对象 */
export type BoolObj = BoolOperateList[number];
/**Eoc条件对象操作符 */
export type BoolOperateList = [
    BoolOperaNot,
    BoolOperaOr,
    BoolOperaAnd,
    BoolOperaCompStr,
    {
        math: [string, "==" | "!=" | ">=" | "<=" | ">" | "<", string];
    },
    HasWieldFlag,
    HasWieldWeaponCategoty,
    HasItem,
    HasItems,
    HasTrait,
    HasEffect,
    OneInChance,
    NoParamCond
];
/**无参条件 */
export type NoParamCond = [
    "u_female",
    "u_male",
    "npc_female",
    "npc_male",
    "u_can_drop_weapon",
    "u_is_alive",
    "npc_is_alive"
][number];
/**有某个效果 */
export type HasEffect = TalkerVar<{
    /**有某个效果
     * 武术static_buffs可以通过形式来检查mabuff:buff_id
     */
    has_effect: EffectID | StrObj;
    /**要求的效果强度 */
    intensity?: NumObj;
    /**检查哪个肢体 */
    bodypart?: BodyPartID;
}, "has_effect">;
/**携带/穿戴/持握/背包里有某个物品 */
export type HasItem = TalkerVar<{
    /**携带/穿戴/持握/背包里有某个物品 */
    has_item: AnyItemID | StrObj;
}, "has_item">;
/**包里有N个某物品 */
export type HasItems = TalkerVar<{
    /**包里有N个某物品 */
    has_items: {
        /**目标物品 */
        item: AnyItemID | StrObj;
        /**要求数量 */
        count: NumObj;
    };
}, "has_items">;
/**有某个变异 */
export type HasTrait = TalkerVar<{
    /**有某个变异 */
    has_trait: MutationID | StrObj;
}, "has_trait">;
/**手中的物品有某个flag */
export type HasWieldFlag = TalkerVar<{
    /**手中的物品有某个flag */
    has_wielded_with_flag: FlagID | StrObj;
}, "has_wielded_with_flag">;
/**手中的物品有某个武器分类 */
export type HasWieldWeaponCategoty = TalkerVar<{
    /**手中的物品有某个武器分类 */
    has_wielded_with_weapon_category: WeaponCategoryID | StrObj;
}, "has_wielded_with_weapon_category">;
/**1/n的概率返回true */
export type OneInChance = {
    /**1/n的概率返回true */
    one_in_chance: NumObj;
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
    GenericObj,
    string,
    LocObj
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
    },
    {
        npc_val: string;
    },
    {
        context_val: string;
    },
    {
        var_val: string;
    }
];
/**通用Obj操作符 */
export type GenericObj = GenericObjOperateList[number];
/**位置Obj */
export type LocObj = GenericObj;
