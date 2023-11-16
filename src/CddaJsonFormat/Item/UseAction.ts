import { EocID } from "../Eoc";
import { FieldID } from "../Field";
import { Color, DescText, Explosion } from "../GenericDefine";
import { NpcClassID } from "../NpcClass";
import { SpellID } from "../Spell";

/**使用效果 */
export type UseAction = [
    UAPlaceNpc        , // 放置NPC
    UARunEoc          , // 运行Eoc
    UAExplosion       , // 产生爆炸
    UALearnSpell      , // 学习法术
    UACastSpell       , // 施法
    UseActionHardcode , // 硬编码
][number];

/**硬编码效果 */
type UseActionHardcode = [
    "ALCOHOL_STRONG"        , // 大幅度增加醉酒程度。添加疾病 drunk。
    "ALCOHOL_WEAK"          , // 稍微增加醉酒程度。添加疾病 drunk。
    "ALCOHOL"               , // 增加醉酒程度。添加疾病 drunk。
    "ANTIBIOTIC"            , // 帮助抵抗感染。移除疾病 infected 并添加疾病 recover。
    "BANDAGE"               , // 停止出血。
    "BIRDFOOD"              , // 使小鸟变得友好。
    "BLECH"                 , // 导致呕吐, 添加疾病 poison, 增加疼痛并伤害躯干。
    "BLECH_BECAUSE_UNCLEAN" , // 导致警告。
    "CATFOOD"               , // 使猫变得友好。
    "CATTLEFODDER"          , // 使大型草食动物变得友好。
    "CHEW"                  , // 显示消息 "You chew your %s.", 但其他什么也不做。
    "CIG"                   , // 缓解尼古丁渴望。添加疾病 cig。
    "COKE"                  , // 减少饥饿。添加疾病 high。
    "CRACK"                 , // 减少饥饿。添加疾病 high。
    "DISINFECTANT"          , // 防止感染。
    "DOGFOOD"               , // 使狗变得友好。
    "FIRSTAID"              , // 治疗。
    "FLUMED"                , // 添加疾病 took_flumed。
    "FLUSLEEP"              , // 添加疾病 took_flumed 并增加疲劳。
    "FUNGICIDE"             , // 杀死真菌和孢子。移除疾病 fungus 和 spores。
    "HALLU"                 , // 添加疾病 hallu。
    "HONEYCOMB"             , // 产生蜡。
    "INHALER"               , // 移除疾病 asthma。
    "IODINE"                , // 添加疾病 iodine。
    "MARLOSS"               , // "当你吃下这颗浆果时, 你有一种近乎宗教的体验, 感觉与你的周围环境融为一体..."
    "METH"                  , // 添加疾病 meth。
    "NONE"                  , // "你不能对你的 [x] 做任何有趣的事情。"
    "PKILL"                 , // 减少疼痛。添加疾病 pkill[n], 其中 [n] 是在此食物上使用的标志 PKILL_[n] 的级别。
    "PLANTBLECH"            , // 如果玩家没有植物突变, 则激活 BLECH iuse 动作。
    "POISON"                , // 添加疾病 poison 和 foodpoison。
    "PROZAC"                , // 如果当前没有出现, 添加疾病 took_prozac, 否则起到轻微的兴奋剂作用。很少有 took_prozac_bad 的不良反应。
    "PURIFIER"              , // 移除随机数量的负面突变。
    "SEWAGE"                , // 导致呕吐。
    "SLEEP"                 , // 大幅度增加疲劳。
    "THORAZINE"             , // 移除疾病 hallu、visuals、high。另外, 如果疾病 dermatik 也不存在, 则移除疾病 formication。有增加疲劳的负面反应的机会。
    "VITAMINS"              , // 增加健康度 (不要与 HP 混淆) 。
    "WEED"                  , // 让你与 Cheech & Chong 一起滚动。添加疾病 weed_high。
    "XANAX"                    , // 缓解焦虑。添加疾病 took_xanax。
][number];


/**放置NPC */
type UAPlaceNpc = {
    /**在地图上放置一个NPC */
    type: "place_npc";
    /**npc职业ID */
    npc_class_id: NpcClassID;
    /**生成时播报的消息 */
    summon_msg?: DescText;
    /**将 npc 随机放置在玩家周围, 如果 false: 让玩家决定将其放置在哪里 (默认值: false)  */
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
    description: DescText;
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
    fields_type?: FieldID;
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