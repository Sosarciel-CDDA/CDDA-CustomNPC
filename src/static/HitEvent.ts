import { saveStaticData } from "./StaticData";


//攻击事件
const HitEvent = [
	{
		"id": "CustomNPC_EOC_MAC",
		"type": "effect_on_condition",
		"effect": [
			{"run_eocs":["hiteocs"]}
		],
		"eoc_type": "EVENT",
		"required_event":"character_melee_attacks_character"
	},
	{
		"id": "CustomNPC_EOC_MAM",
		"type": "effect_on_condition",
		"effect": [
			{"run_eocs":["hiteocs"]}
		],
		"eoc_type": "EVENT",
		"required_event":"character_melee_attacks_monster"
	},
	{
		"id": "CustomNPC_EOC_RAC",
		"type": "effect_on_condition",
		"effect": [
			{"run_eocs":["hiteocs"]}
		],
		"eoc_type": "EVENT",
		"required_event":"character_ranged_attacks_character"
	},
	{
		"id": "CustomNPC_EOC_RAM",
		"type": "effect_on_condition",
		"effect": [
			{"run_eocs":["hiteocs"]}
		],
		"eoc_type": "EVENT",
		"required_event":"character_ranged_attacks_monster"
	}
]

saveStaticData('HitEvent',HitEvent);
