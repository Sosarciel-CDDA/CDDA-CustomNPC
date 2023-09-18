import { AnyItemID } from "../Item";
import { MutationID } from "../Mutattion";
import { NpcInstanceID } from "../NpcInstance";
import { EocID } from "./Eoc";
/**Eoc效果 */
export type EocEffect = EocEffectList[number];
/**Eoc效果表 */
export type EocEffectList = [
    {
        math: [string, "=", string];
    },
    {
        u_lose_trait: MutationID;
    },
    {
        run_eocs: EocID | EocID[];
    },
    {
        u_add_trait: MutationID;
    },
    {
        u_consume_item: AnyItemID;
        count: number;
    },
    "drop_weapon",
    SpawnNpc,
    {
        u_spawn_item: AnyItemID;
    },
    "follow_only"
];
/**生成Npc */
type SpawnNpc = {
    /**Npc实例ID */
    u_spawn_npc: NpcInstanceID;
    /**真实数量 */
    real_count?: number;
    /**最小半径 */
    min_radius?: number;
    /**最大半径 */
    max_radius?: number;
};
export {};
