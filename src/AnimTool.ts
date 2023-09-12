import { UtilFT } from "@zwa73/utils";
import { Armor, genArmorID } from "./CddaJsonFormat/Armor";
import { Mutation, genMutationID } from "./CddaJsonFormat/Mutattion";
import { outCharFile } from "./Data";






/**可用的动画类型列表 */
export const AnimTypeList = ["Idle"] as const;
/**动画类型 */
export type AnimType = typeof AnimTypeList[number];

/**生成某角色的动作id */
export function formatAnimName(charName:string,animType:AnimType){
    return `${charName}${animType}`
}

/**创建动画辅助工具
 * @param charName 角色名
 */
export async function createAnimTool(charName:string){
    for(const animType of AnimTypeList){
        const animName = formatAnimName(charName,animType);
        const animMut:Mutation={
            type:"mutation",
            id:genMutationID(animName),
            name:`${charName}的${animType}动画变异`,
            description:`${charName}的${animType}动画变异`,
            integrated_armor:[genArmorID(animName)]
        }
        const animArmor:Armor={
            type:"ARMOR",
            id:`CNPC_ARMOR_${animName}`,
            name:`${charName}的${animType}动画变异`,
            description:`${charName}的${animType}动画变异`,
            category:"clothing",
            weight: 0,
            volume: 0,
            armor:[{
                layers:["AURA"],
            }]
        }
        await outCharFile(charName,'anim_tool.json',[animMut,animArmor]);
    }
}