import { EocID } from "./EOC";
import { DefineNpcFaction } from "./GenericDefine";
import { NpcClassID } from "./NpcClass";



/**NpcInstance ID格式 */
export type NpcInstanceID = `${string}_NPC_${string}`;

/**Npc实例 */
export type NpcInstance = {
    type: "npc";
    id: NpcInstanceID;
    /**独特名称 */
    name_unique?:string;
    /**名称后缀 */
    name_suffix?: string;
    /**职业 */
    class: NpcClassID,
    attitude: number,
    mission: number,
    chat: string,
    faction?: DefineNpcFaction,
    death_eocs?: EocID[],
    age?: number,
    height?: number,
    str?: number,
    dex?: number,
    int?: number,
    per?: number,
    personality?: {
        aggression?  : number;
        bravery?     : number;
        collector?   : number;
        altruism?    : number;
    }
}



