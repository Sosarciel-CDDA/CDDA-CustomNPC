"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HitEvent = void 0;
const StaticData_1 = require("./StaticData");
//攻击事件
exports.HitEvent = [
    {
        "id": "CNPC_EOC_MAC",
        "type": "effect_on_condition",
        "effect": [
            { "run_eocs": ["CNPC_EOC_MeleeHitEvent"] }
        ],
        "eoc_type": "EVENT",
        "required_event": "character_melee_attacks_character"
    },
    {
        "id": "CNPC_EOC_MAM",
        "type": "effect_on_condition",
        "effect": [
            { "run_eocs": ["CNPC_EOC_MeleeHitEvent"] }
        ],
        "eoc_type": "EVENT",
        "required_event": "character_melee_attacks_monster"
    },
    {
        "id": "CNPC_EOC_RAC",
        "type": "effect_on_condition",
        "effect": [
            { "run_eocs": ["CNPC_EOC_RangeHitEvent"] }
        ],
        "eoc_type": "EVENT",
        "required_event": "character_ranged_attacks_character"
    },
    {
        "id": "CNPC_EOC_RAM",
        "type": "effect_on_condition",
        "effect": [
            { "run_eocs": ["CNPC_EOC_RangeHitEvent"] }
        ],
        "eoc_type": "EVENT",
        "required_event": "character_ranged_attacks_monster"
    }
];
(0, StaticData_1.saveStaticData)('hit_event', exports.HitEvent);
