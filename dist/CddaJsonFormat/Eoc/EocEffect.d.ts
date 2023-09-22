import { FakeSpell } from "../Enchantment";
import { AnyItemID } from "../Item";
import { MutationID } from "../Mutattion";
import { NpcInstanceID } from "../NpcInstance";
import { EocID, InlineEoc } from "./Eoc";
import { NumObj, StrObj } from "./VariableObject";
/**Eoc效果 */
export type EocEffect = EocEffectList[number];
/**Eoc效果表 */
export type EocEffectList = [
    {
        math: [string, "=" | "+=" | "-=" | "*=" | "/=", string];
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
    "follow_only",
    SoundEffect,
    CastSpell
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
/**播放声音 */
type SoundEffect = {
    /**音效ID */
    id: StrObj;
    /**变体ID */
    sound_effect?: StrObj;
    /**如果为true则视为在玩家地下 ? */
    outdoor_event?: boolean;
    /**音量 */
    volume: NumObj;
};
/**施法 */
type CastSpell = {
    u_cast_spell: FakeSpell;
    /**默认为 false；如果为 true，则允许您瞄准施放的法术，
     * 否则将其施放于随机位置，就像RANDOM_TARGET使用了法术标志一样
     * RANDOM_TARGET法术需要此项目为true才能正常索敌
     */
    targeted?: boolean;
    /**成功施法后运行的eoc */
    true_eocs?: ParamsEoc;
    /**施法失败后运行的eoc */
    false_eocs?: ParamsEoc;
};
/**参数Eoc */
export type ParamsEoc = (EocID | StrObj | InlineEoc) | (EocID | StrObj | InlineEoc)[];
export {};
