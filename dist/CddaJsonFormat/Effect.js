"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectModTypeList = exports.DefineEffectIDList = void 0;
/**预定义的EffectID 列表 */
exports.DefineEffectIDList = [
    "npc_run_away",
    "npc_suspend",
    "incorporeal",
    "stunned",
    "downed",
    "grabbed", //被抓住
];
/**
 * X_amount       - 当效果被放置时, X的应用量。像应用消息一样, 它只会在新效果上触发
 * X_min          - 当滚动触发时, 应用的X的最小量 “X_max” - 当滚动触发时, 应用的X的最大量 (没有条目意味着它每次都会给出精确的X_min, 而不是rng(min, max))
 * X_min_val      - 效果将推动你到的最小值, 0表示无上限！对于某些X不存在！
 * X_max_val      - 效果将推动你到的最大值, 0表示无上限！对于某些X不存在！
 * X_chance       - X每次触发的基本概率, 取决于 “X_chance_bot” 的确切公式
 * X_chance_bot   - 如果这个不存在, 那么触发概率是 (1 in “X_chance”)。如果这个存在, 那么概率是 (“X_chance” in “X_chance_bot”)
 * X_tick         - 每Y tick, 效果滚动以触发X
 */
/**效果调整类型 列表
 * chance_bot 如果不存在, 则触发机会为 1/X_chance
 * 如果确实存在, 那么机会是 X_chance/X_chance_bot
 */
exports.EffectModTypeList = [
    "str_mod",
    "dex_mod",
    "per_mod",
    "int_mod",
    "speed_mod",
    "pain_amount",
    "pain_min",
    "pain_max",
    "pain_max_val",
    "pain_chance",
    "pain_chance_bot",
    "pain_tick",
    "hurt_amount",
    "hurt_min",
    "hurt_max",
    "hurt_chance",
    "hurt_chance_bot",
    "hurt_tick",
    "sleep_amount",
    "sleep_min",
    "sleep_max",
    "sleep_chance",
    "sleep_chance_bot",
    "sleep_tick",
    "pkill_amount",
    "pkill_min",
    "pkill_max",
    "pkill_max_val",
    "pkill_chance",
    "pkill_chance_bot",
    "pkill_tick",
    "stim_amount",
    "stim_min",
    "stim_max",
    "stim_min_val",
    "stim_max_val",
    "stim_chance",
    "stim_chance_bot",
    "stim_tick",
    "health_amount",
    "health_min",
    "health_max",
    "health_min_val",
    "health_max_val",
    "health_chance",
    "health_chance_bot",
    "health_tick",
    "h_mod_amount",
    "h_mod_min",
    "h_mod_max",
    "h_mod_min_val",
    "h_mod_max_val",
    "h_mod_chance",
    "h_mod_chance_bot",
    "h_mod_tick",
    "rad_amount",
    "rad_min",
    "rad_max",
    "rad_max_val",
    "rad_chance",
    "rad_chance_bot",
    "rad_tick",
    "hunger_amount",
    "hunger_min",
    "hunger_max",
    "hunger_min_val",
    "hunger_max_val",
    "hunger_chance",
    "hunger_chance_bot",
    "hunger_tick",
    "thirst_amount",
    "thirst_min",
    "thirst_max",
    "thirst_min_val",
    "thirst_max_val",
    "thirst_chance",
    "thirst_chance_bot",
    "thirst_tick",
    "perspiration_amount",
    "perspiration_min",
    "perspiration_max",
    "perspiration_min_val",
    "perspiration_max_val",
    "perspiration_chance",
    "perspiration_chance_bot",
    "perspiration_tick",
    "fatigue_amount",
    "fatigue_min",
    "fatigue_max",
    "fatigue_min_val",
    "fatigue_max_val",
    "fatigue_chance",
    "fatigue_chance_bot",
    "fatigue_tick",
    "stamina_amount",
    "stamina_min",
    "stamina_max",
    "stamina_min_val",
    "stamina_max_val",
    "stamina_chance",
    "stamina_chance_bot",
    "stamina_tick",
    "cough_chance",
    "cough_chance_bot",
    "cough_tick",
    // 重要的是不要在突变中 vomit_chance 与 vomit_multiplier 交互, 因此是硬编码的。 基本呕吐几率为强度/ (基本呕吐几率 + 缩放呕吐几率)。
    "vomit_chance",
    "vomit_chance_bot",
    "vomit_tick",
    "healing_rate",
    "healing_head",
    "healing_torso",
    "dodge_mod",
    "hit_mod",
    "bash_mod", // 额外的 bash 奖励/惩罚
];
