import { JArray, JObject, JToken } from "@zwa73/utils";
import { FakeSpell } from "../Enchantment";
import { AnyItemID } from "../Item";
import { MutationID } from "../Mutattion";
import { NpcInstanceID } from "../NpcInstance";
import { SoundEffectID, SoundEffectVariantID } from "../SoundEffect";
import { Eoc, EocID, InlineEoc, TalkerVar } from "./Eoc";
import { NumObj, StrObj } from "./VariableObject";










/**Eoc效果 */
export type EocEffect = EocEffectList[number];
/**Eoc效果表 */
export type EocEffectList = [
    {math:[string,"="|"+="|"-="|"*="|"/=",string]}  ,//
    {u_lose_trait:MutationID}                       ,//失去某个变异
    {run_eocs:ParamsEoc}                            ,//运行Eoc
    {u_add_trait:MutationID}                        ,//获得某个变异
    {u_consume_item: AnyItemID,count: number }      ,//使用/扣除 count 个物品
    "drop_weapon"                                   ,//丢下手持物品 仅限npc
    SpawnNpc                                        ,//生成npc
    {u_spawn_item:AnyItemID}                        ,//生成物品
    "follow_only"                                   ,//让npc跟随玩家
    SoundEffect                                     ,//播放声音
    CastSpell                                       ,//施法
];
/**生成Npc */
type SpawnNpc = TalkerVar<{
    /**Npc实例ID */
    spawn_npc: NpcInstanceID,
    /**真实数量 */
    real_count?: number,
    /**最小半径 */
    min_radius?: number,
    /**最大半径 */
    max_radius?: number,
},"spawn_npc">;
/**播放声音 */
type SoundEffect = {
    /**音效ID */
    id          :  StrObj|SoundEffectID;
    /**变体ID */
    sound_effect?: StrObj|SoundEffectVariantID;
    /**如果为true则视为在玩家地下 ? */
    outdoor_event?: boolean;
    /**音量 */
    volume:NumObj;
}
/**施法 */
type CastSpell = TalkerVar<{
    /**施法 */
    cast_spell:FakeSpell;
    /**默认为 false；如果为 true，则允许您瞄准施放的法术，
     * 否则将其施放于随机位置，就像RANDOM_TARGET使用了法术标志一样
     * RANDOM_TARGET法术需要此项目为true才能正常索敌
     */
    targeted?:boolean;
    /**成功施法后运行的eoc */
    true_eocs?:ParamsEoc;
    /**施法失败后运行的eoc */
    false_eocs?:ParamsEoc;
},"cast_spell">;



/**参数Eoc */
export type ParamsEoc = (EocID|StrObj|InlineEoc)|(EocID|StrObj|InlineEoc)[];