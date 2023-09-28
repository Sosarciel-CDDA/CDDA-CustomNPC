import { EocID } from "../Eoc";
import { Color, Explosion } from "../GenericDefine";
import { NpcClassID } from "../NpcClass";
import { SpellID } from "../Spell";

/**使用效果 */
export type UseAction = [
    UAPlaceNpc      ,//放置NPC
    UARunEoc        ,//运行Eoc
    UAExplosion     ,//产生爆炸
    UALearnSpell    ,//学习法术
    UACastSpell     ,//施法
][number];
/**放置NPC */
type UAPlaceNpc = {
	/**在地图上放置一个NPC */
	type: "place_npc";
	/**npc职业ID */
	npc_class_id: NpcClassID;
	/**生成时播报的消息 */
	summon_msg?: string;
	/**将 npc 随机放置在玩家周围，如果 false：让玩家决定将其放置在哪里（默认值：false） */
	place_randomly?: boolean;
	/**该动作需要多少移动点 */
	moves?: number;
	/**随机 NPC 放置的最大半径。 */
	radius?: number;
}
/**运行Eoc */
type UARunEoc = {
	/**执行某个ECO */
	type: "effect_on_conditions";
	/**说明 */
	description: string;
	/**eoc列表 */
	effect_on_conditions: EocID[];
}
/**产生爆炸 */
type UAExplosion = {
	/**产生爆炸 */
	type: "explosion";
    /**爆炸数据 */
	explosion: Explosion;
	/**绘制爆炸半径的大小 */
	draw_explosion_radius?: number;
	/**绘制爆炸时使用的颜色。 */
	draw_explosion_color?: Color;
	/**是否做闪光弹效果 */
	do_flashbang?: boolean;
	/**玩家是否免疫闪光弹效果 */
	flashbang_player_immune?: boolean;
	/**产生的地形效果的传播半径 */
	fields_radius?: number;
	/**产生的地形效果 */
	fields_type?: string;
	/**产生的地形效果的最小强度 */
	fields_min_intensity?: number;
	/**产生的地形效果的最大强度 */
	fields_max_intensity?: number;
	/**爆炸产生的 EMP 爆炸半径 */
	emp_blast_radius?: number;
	/**爆炸产生的扰频器爆炸半径 */
	scrambler_blast_radius?: number;
};
/**学习法术 */
type UALearnSpell = {
    /**学习法术 */
    type: "learn_spell";
    /**学习的法术列表 */
    spells: SpellID[];
}
/**施法 */
type UACastSpell = {
    /**施法 */
    type: "cast_spell";
    /**法术ID */
    spell_id: SpellID;
    /**不会失败 */
    no_fail?: boolean;
    /**法术等级 */
    level: number;
    /**需要穿戴此物品才能施法 */
    need_worn?: boolean;
}