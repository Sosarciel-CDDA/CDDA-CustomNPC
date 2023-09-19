"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellSoundTypeList = exports.SpellEnergySourceList = exports.SpellFlagList = exports.SpellShapeList = exports.SpellEffectList = exports.SpellTargetList = void 0;
/**法术有效目标 列表 */
exports.SpellTargetList = [
    "hostile",
    "ground",
    "self",
    "ally",
    "none", //无
];
/**法术效果 列表 */
exports.SpellEffectList = [
    "area_pull",
    "area_push",
    "attack",
    "banishment",
    "bash",
    "charm_monster",
    "dash",
    "directed_push",
    "effect_on_condition",
    "emit",
    "explosion",
    "flashbang",
    "fungalize",
    "guilt",
    "map",
    "mod_moves",
    "morale",
    "mutate",
    "noise",
    "pain_split",
    "pull_target",
    "recover_energy",
    "remove_effect",
    "remove_field",
    "revive",
    "short_range_telepor",
    "slime_split",
    "spawn_item",
    "summon",
    "summon_vehicle",
    "targeted_polymorph",
    "ter_transform",
    "timed_event",
    "translocate",
    "upgrade",
    "vomit", //任何处于其范围内的生物都会立即呕吐，如果它能够这样做的话。
];
/**法术范围形状 列表*/
exports.SpellShapeList = [
    "blast",
    "cone",
    "line", //发射一条宽度等于 aoe 的线。
];
/**法术Flag 列表*/
exports.SpellFlagList = [
    "CONCENTRATE",
    "EXTRA_EFFECTS_FIRST",
    "FRIENDLY_POLY",
    "HOSTILE_SUMMON",
    "HOSTILE_50",
    "IGNITE_FLAMMABLE",
    "IGNORE_WALLS",
    "LOUD",
    "MUST_HAVE_CLASS_TO_LEARN",
    "MUTATE_TRAIT",
    "NO_EXPLOSION_SFX",
    "NO_FAIL",
    "NO_HANDS",
    "NO_LEGS",
    "NO_PROJECTILE",
    "NON_MAGICAL",
    "PAIN_NORESIST",
    "PERCENTAGE_DAMAGE",
    "PERMANENT",
    "PERMANENT_ALL_LEVELS",
    "POLYMORPH_GROUP",
    "RANDOM_AOE",
    "RANDOM_CRITTER",
    "RANDOM_DAMAGE",
    "RANDOM_DURATION",
    "RANDOM_TARGET",
    "SILENT",
    "SOMATIC",
    "SPAWN_GROUP",
    "SPAWN_WITH_DEATH_DROPS",
    "SWAP_POS",
    "TARGET_TELEPORT",
    "UNSAFE_TELEPORT",
    "VERBAL",
    "WONDER", //这极大地改变了父法术的行为：法术本身不施放，但伤害和范围信息用于施放extra_effects。extra_effects将随机选择n个施放，其中n是法术当前的伤害（与RANDOM_DAMAGE旗帜叠加），施放法术的消息也会显示。如果不需要这个咒语的消息，请确保message它是一个空字符串。
];
/**法术能量池 列表 */
exports.SpellEnergySourceList = [
    "MANA", "BIONIC", "HP", "STAMINA", "NONE"
];
/**法术声音类型 列表 */
exports.SpellSoundTypeList = [
    "background", "weather", "music", "movement", "speech", "activity",
    "destructive_activity", "alarm", "combat", "alert", "order",
];
