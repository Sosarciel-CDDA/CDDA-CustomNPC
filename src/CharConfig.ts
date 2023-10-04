import * as path from 'path';
import * as  fs from 'fs';
import { AnyItemID, EnchArmorValType, EnchGenericValType, Generic, Gun, MutationID, SkillID, StatusSimple } from "CddaJsonFormat";
import { CharSkill } from "./CharSkill";
import { JObject, UtilFT } from "@zwa73/utils";
import { DataManager } from './DataManager';



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
    /**基础属性 */
    base_status?:Record<StatusSimple,number>;
    /**基础技能 */
    base_skill?:Partial<Record<SkillID|"ALL",number>>;
    /**附魔属性 */
    ench_status?:Partial<Record<EnchStat,number>>;
    /**固定的武器 */
    weapon?:Gun|Generic;
    /**技能 */
    skill?:CharSkill[];
    /**强化项 */
    upgrade?:CharUpgrade[];
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
     * [[[一级的物品ID,数量],[一级的另一个物品ID,数量]]
     * [[二级的物品ID,数量],[二级的另一个物品ID,数量]]]
     */
    require_resource:([AnyItemID,number]|AnyItemID)[][];
    /**每个强化等级提升的附魔属性 */
    lvl_ench_status?:Partial<Record<EnchStat,number>>;
    /**只要拥有此字段就会添加的附魔属性 */
    ench_status?:Partial<Record<EnchStat,number>>;
    /**到达特定强化等级时将会获得的变异
     * [拥有字段时获得的变异ID,[变异ID,强化等级],[第二个变异ID,强化等级]]
     */
    mutation?:([MutationID,number]|MutationID)[];
}


/**变量属性 */
export type EnchStat = EnchGenericValType|EnchArmorValType;

let count=0;
/**读取某个角色的CharConfig */
export async function loadCharConfig(dm:DataManager,charName:string):Promise<CharConfig>{
    count++;
    if(count>1000) throw 'loadCharConfig 调用次数过多(>1000) 可能是循环继承';
    const charConfig:CharConfig = await UtilFT.loadJSONFile(path.join(dm.getCharPath(charName),'config')) as any;
    if(charConfig.extends?.includes(charName)) throw `${charName} 不应继承自身`;
    const exts:CharConfig[] = [];
    for(const char of charConfig.extends||[])
        exts.push( (await dm.getCharData(char)).charConfig);
    return extendCharConfig(charConfig,...exts);
}

//继承
function extendCharConfig(target:JObject,...sources:JObject[]):JObject{
    sources = [...sources.reverse(),target];
    let out:JObject = {};
    for(const obj of sources){
        for(const key in obj){
            const value = obj[key];
            if(Array.isArray(value)){
                out[key] = out[key]==null
                    ? value
                    : [...(out[key] as []),...value];
            }else if(typeof value == "object"){
                out[key] = out[key]==null
                    ? value
                    : Object.assign({},out[key],value)
            }else out[key] = value;
        }
    }
    return out;
}

