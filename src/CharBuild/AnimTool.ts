import * as path from 'path';
import { Armor, BodyPartList, Mutation, ItemGroup } from "cdda-schema";
import { DataManager } from "../DataManager";






/**可用的动画类型列表 */
export const AnimTypeList = ["Idle","Move","Attack"] as const;
/**动画类型 */
export type AnimType = typeof AnimTypeList[number];

/**生成某角色的动作id */
export function formatAnimName(charName:string,animType:AnimType){
    return `${charName}${animType}`
}

/**创建动画辅助工具  
 * @param charName 角色名  
 */
export async function createAnimTool(dm:DataManager,charName:string){
    const {defineData,outData} = await dm.getCharData(charName);
    for(const animType of defineData.validAnim){
        const animData = defineData.animData[animType];
        const animMut:Mutation={
            type:"mutation",
            id:animData.mutID,
            name:`${charName}的${animType}动画变异`,
            description:`${charName}的${animType}动画变异`,
            //integrated_armor:[animData.armorID],
            restricts_gear  : [...BodyPartList],
            remove_rigid    : [...BodyPartList],
            points:0,
            purifiable:false,
            valid:false,
            player_display:false,
        }
        const animArmor:Armor={
            type:"ARMOR",
            id:animData.armorID,
            name:`${charName}的${animType}动画变异装备`,
            description:`${charName}的${animType}动画变异装备`,
            category:"clothing",
            weight: 0,
            volume: 0,
            symbol: "O",
            flags:["AURA","UNBREAKABLE","INTEGRATED","ZERO_WEIGHT"],
        }
        const animArmorGroup:ItemGroup={
            type:"item_group",
            id:animData.itemGroupID,
            subtype:"collection",
            items:[animData.armorID]
        }
        outData[path.join("anime",animType)] = [animMut,animArmor,animArmorGroup];
    }
}