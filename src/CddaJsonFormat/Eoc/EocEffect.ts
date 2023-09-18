import { AnyItemID } from "../Item";
import { MutationID } from "../Mutattion";
import { NpcInstanceID } from "../NpcInstance";
import { EocID } from "./Eoc";










/**Eoc效果 */
export type EocEffect = EocEffectList[number];
/**Eoc效果表 */
export type EocEffectList = [
    {math:[string,"=",string]}                  ,//
    {u_lose_trait:MutationID}                   ,//失去某个变异
    {run_eocs:EocID|EocID[]}                    ,//运行Eoc
    {u_add_trait:MutationID}                    ,//获得某个变异
    {u_consume_item: AnyItemID,count: number }  ,//使用/扣除 count 个物品
    "drop_weapon"                               ,//丢下手持物品 仅限npc
    SpawnNpc                                    ,//生成npc
    {u_spawn_item:AnyItemID}                    ,//生成物品
    "follow_only"                               ,//让npc跟随玩家
];
/**生成Npc */
type SpawnNpc = {
    /**Npc实例ID */
    u_spawn_npc: NpcInstanceID,
    /**真实数量 */
    real_count?: number,
    /**最小半径 */
    min_radius?: number,
    /**最大半径 */
    max_radius?: number,
}