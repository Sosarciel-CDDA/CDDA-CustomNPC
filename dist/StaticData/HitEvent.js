"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HitEvent = void 0;
const StaticData_1 = require("./StaticData");
//攻击事件
exports.HitEvent = [
    {
        "id": "CustomNPC_EOC_MAC",
        "type": "effect_on_condition",
        "effect": [
            { "run_eocs": ["hiteocs"] }
        ],
        "eoc_type": "EVENT",
        "required_event": "character_melee_attacks_character"
    },
    {
        "id": "CustomNPC_EOC_MAM",
        "type": "effect_on_condition",
        "effect": [
            { "run_eocs": ["hiteocs"] }
        ],
        "eoc_type": "EVENT",
        "required_event": "character_melee_attacks_monster"
    },
    {
        "id": "CustomNPC_EOC_RAC",
        "type": "effect_on_condition",
        "effect": [
            { "run_eocs": ["hiteocs"] }
        ],
        "eoc_type": "EVENT",
        "required_event": "character_ranged_attacks_character"
    },
    {
        "id": "CustomNPC_EOC_RAM",
        "type": "effect_on_condition",
        "effect": [
            { "run_eocs": ["hiteocs"] }
        ],
        "eoc_type": "EVENT",
        "required_event": "character_ranged_attacks_monster"
    }
];
(0, StaticData_1.saveStaticData)('HitEvent', exports.HitEvent);
