export type NpcInstance = {
    type: "npc";
    id: string;
    name_unique?: string;
    name_suffix?: string;
    class?: string;
    attitude?: 0;
    mission?: 0;
    chat?: string;
    faction?: string;
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
