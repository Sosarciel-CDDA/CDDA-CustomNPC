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
    name_unique?: string;
    /**名称后缀 */
    name_suffix?: string;
    /**职业 */
    class: NpcClassID;
    attitude: NpcAttitude;
    mission: NpcMission;
    chat: TalkTopicID;
    faction?: DefineNpcFaction;
    death_eocs?: EocID[];
    age?: number;
    height?: number;
    str?: number;
    dex?: number;
    int?: number;
    per?: number;
    personality?: {
        aggression?: number;
        bravery?: number;
        collector?: number;
        altruism?: number;
    };
};
/**NPC态度 列表 */
export declare const NpcAttitudeList: readonly [0, 1, 3, 7, 10, 11];
/**NPC态度 */
export type NpcAttitude = typeof NpcAttitudeList[number];
/**Npc行为 列表 */
export declare const NpcMissionList: readonly [0, 3, 7];
/**Npc行为 */
export type NpcMission = typeof NpcMissionList[number];
