import { EocID } from "./Eoc";
import { CddaID, DefineNpcFaction } from "./GenericDefine";
import { NpcClassID } from "./NpcClass";
import { TalkTopicID } from "./TalkTopic";



/**NpcInstance ID格式 */
export type NpcInstanceID = CddaID<"NPC">;

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
    attitude: NpcAttitude,
    mission: NpcMission,
    chat: TalkTopicID,
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

/**NPC态度 列表 */
export const NpcAttitudeList = [
    0   ,// null，NPC可以做自己的事情
    1   ,// 说话，NPC会尝试接近玩家并与他们交谈
    3   ,// 跟随，NPC是玩家的好友，可以被指挥
    7   ,// 防御，NPC 留在原地防御自己
    10  ,// 杀死，NPC 试图杀死玩家
    11  ,// 逃离，NPC逃离玩家
] as const;
/**NPC态度 */
export type NpcAttitude = typeof NpcAttitudeList[number];

/**Npc行为 列表 */
export const NpcMissionList = [
    0 ,// null，NPC可以做自己的事情
    3 ,// 店主，NPC 停留在一处，但会尝试与玩家进行交易
    7 ,// 守卫，NPC 留在原地
] as const;
/**Npc行为 */
export type NpcMission = typeof NpcMissionList[number];