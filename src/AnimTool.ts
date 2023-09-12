import { UtilFT } from "@zwa73/utils";
import { Armor } from "./CddaJsonFormat/Armor";
import { Mutation } from "./CddaJsonFormat/Mutattion";
import { getOutCharPath, outCharFile } from "./Data";
import * as path from 'path';






/**可用的动画类型列表 */
export const AnimTypeList = ["Idel"] as const;
/**动画类型 */
export type AnimType = typeof AnimTypeList[number];

/**创建动画辅助工具
 * @param charName 角色名
 */
export async function createAnimTool(charName:string){
    for(const animType of AnimTypeList){
        const formatAnimName = `${charName}${animType}`;
        const animMut:Mutation={
            type:"mutation",
            id:`CNPC_MUT_${formatAnimName}`,
            name:`${charName}的${animType}动画变异`,
            description:`${charName}的${animType}动画变异`,
            integrated_armor:[`CNPC_ARMOR_${formatAnimName}`]
        }
        const animArmor:Armor={
            type:"ARMOR",
            id:`CNPC_ARMOR_${formatAnimName}`,
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