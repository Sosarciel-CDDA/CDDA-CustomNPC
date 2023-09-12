export type NpcInstance = {
    type: "npc";
    id: string;
    name_unique?: string;
    name_suffix?: string;
    class?: string;
    attitude?: number;
    mission?: number;
    chat?: string;
    faction?: DefineFaction;
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
export type DefineFaction = "your_followers" | "no_faction";
