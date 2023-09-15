import { DefineNpcFaction } from "./GenericDefine";
export type NpcInstance = {
    type: "npc";
    id: string;
    /**独特名称 */
    name_unique?: string;
    /**名称后缀 */
    name_suffix?: string;
    /**职业 */
    class: string;
    attitude: number;
    mission: number;
    chat: string;
    faction?: DefineNpcFaction;
    death_eocs?: string[];
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
