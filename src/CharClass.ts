import { NpcClass } from "./CddaJsonFormat/NpcClass";
import { NpcInstance, genNpcInstanceID } from "./CddaJsonFormat/NpcInstance";
import { outCharFile } from "./Data";





/**创建角色职业和实例
 * @param charName 角色名
 */
export async function createCharClass(charName:string){
    const charClass:NpcClass={
        type:"npc_class",
        id:genNpcInstanceID(charName),
        name:charName,
        job_description:`${charName}专用的职业`,
        common: false,
    }
    const charInstance:NpcInstance={
        type:"npc",
        id:genNpcInstanceID(charName),
        name_unique:charName,
    }
    await outCharFile(charName,'npc.json',[charClass,charInstance]);
}