import { AnyItem, AnyItemID, EnchArmorValType, EnchArmorValTypeList, EnchGenericValType, EnchModVal, EnchValType, EocEffect, Generic, Gun, MutationID, NpcBaseSpells, NpcGender, NumMathExp, NumObj, SkillID, StatusSimple } from "@sosarciel-cdda/sclema";
import { CharSkill } from "./CharSkill";



/**动态读取的角色设定 */
export type CharConfig = {
    /**角色名 继承自哪个角色  
     * 数组将会拼接  
     * 对象将会合并  
     * 简单量将会覆盖  
     * 多个继承冲突时 排在前的将会覆盖排在后的  
     */
    extends?:string[];
    /**是虚拟的/仅用于继承的 */
    virtual?:boolean;
    /**描述信息 */
    desc?:CharDesc;
    /**基础属性  
     * 最低4 最高14  
     * 04-12 每级 1  
     * 12-14 每级 2  
    */
    base_status?:Record<StatusSimple,number>;
    /**基础技能  
     * 00->02 1  
     * 02->03 1  
     * 03->04 2  
     * 04->05 2  
     * 05->06 3  
     * 06->07 3  
     * 07->08 4  
     * 08->09 4  
     * 09->10 5  
     */
    base_skill?:Partial<Record<SkillID|"ALL",number>>;
    /**基础法术 */
    base_spell?:NpcBaseSpells;
    /**基础变量 将会直接在初始化时应用 */
    base_var?  :Record<string,number>;
    /**基础变异 */
    base_mutation?:MutationID[];
    /**附魔属性 */
    ench_status?:EnchStatTable;
    /**固定的武器  
     * 如果武器丢失会自动刷新
     */
    weapon?:CharWeapon[];
    /**技能 */
    skill?:CharSkill[];
    /**强化项 */
    upgrade?:CharUpgrade[];
    /**携带的物品 */
    carry?: CharCarry[];
}

/**角色描述信息 */
export type CharDesc = {
    /**年龄 */
    age?:number;
   /**身高 */
    height?:number;
    /**性别 */
    gender?:NpcGender;
}

/**要求的资源 */
export type RequireResource = {
    /**物品ID */
    id:AnyItemID;
    /**需求数量 默认1 */
    count?:number;
    /**不会消耗 默认 false*/
    not_consume?:boolean;
}
/**角色强化项 */
export type CharUpgrade = {
    /**强化项ID  
     * 作为全局变量`${charName}_${fieled}`  
     */
    field:string;
    /**最大强化等级 未设置则为require_resource长度  
     * 若 require_resource 设置的长度不足以达到最大等级  
     * 则以最后一组材料填充剩余部分  
     */
    max_lvl?:number;
    /**所需要消耗的资源  
     * 物品[等级][或][与]  
     * 如在0升至1级时需要 10x魔力结晶与1x诱变剂 或 1x魔法水晶,1x诱变剂 如下  
     * [  
     * [[10x魔力结晶,1x诱变剂],[1x魔法水晶,1x诱变剂]]  
     * ]  
     */
    require_resource:(RequireResource|AnyItemID)[][][];
    /**每个强化等级提升的附魔属性 */
    lvl_ench_status?:EnchStatTable;
    /**只要拥有此字段就会添加的附魔属性 */
    ench_status?:EnchStatTable;
    /**到达特定强化等级时将会获得的变异  
     * [拥有字段时获得的变异ID,[变异ID,强化等级],[第二个变异ID,强化等级]]  
     */
    mutation?:({id:MutationID,lvl:number}|MutationID)[];
    /**对这个升级项的说明 */
    desc?:string;
    /**每次升级时将会应用的EocEffect  
     * u是玩家 n是角色
     */
    effect?:EocEffect[];
}

/**角色武器 */
export type CharWeapon = {
    /**武器物品 */
    item: AnyItem;
    /**要求强化字段 [字段,强化等级] 或 字段名 */
    require_field?:[string,number]|string;
}
/**角色携带物品 */
export type CharCarry = {
    /**物品 */
    item:AnyItem|AnyItemID;
    /**数量 默认1 */
    count?:number;
    /**初始数量 默认等同于count */
    start_count?:number;
    /**自动回复间隔 未定义则不回复
     * 单位为60次刷新 即 CharUpdateSlow
     */
    recharge?:number;
    /**每次自动回复的数量 未设置则为1 可能会突破count上限 */
    recharge_count?:number;
    /**自动回复要求的强化字段 [字段,强化等级] 或 字段名 */
    require_field?:[string,number]|string;
}

/**变量属性表 */
export type EnchStatTable = Partial<Record<
    EnchGenericValType|EnchArmorValType,
    Pick<EnchModVal,"multiply"|"add">
>>;
function parseMath(obj?:NumObj):NumMathExp|undefined{
    if(obj===undefined) return undefined;
    if(typeof obj==="number") return {math:[`${obj}`]};
    if("math" in obj) return {math:[obj.math[0]]};
    throw `属性仅支持 number 或 math表达式 无效的附魔属性:${obj}`;
}
/**解析变量属性表 */
export function parseEnchStatTable(table?:EnchStatTable):StatModVal[]{
    if(table==null) return[];
    let out:StatModVal[] = [];
    for(const key in table){
        const field = key as EnchGenericValType|EnchArmorValType;
        const {add,multiply} = table[field]!;
        out.push({
            value:field,
            add:parseMath(add),
            multiply:parseMath(multiply)
        })
    }
    return out;
}
/**变量属性专用的增幅 */
type StatModVal = {
    /**附魔增幅类型 */
    value    :EnchGenericValType|EnchArmorValType;
    /**倍率增幅 1为+100% */
    multiply?:NumMathExp;
    /**加值增幅 在计算倍率前先添加 */
    add     ?:NumMathExp;
}



