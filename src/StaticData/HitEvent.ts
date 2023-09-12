import { saveStaticData } from "./StaticData";


//攻击事件
export const HitEvent = [
	{
		"id": "CNPC_EOC_MAC",
		"type": "effect_on_condition",
		"effect": [
			{"run_eocs":["CNPC_EOC_HitEocs"]}
		],
		"eoc_type": "EVENT",
		"required_event":"character_melee_attacks_character"
	},
	{
		"id": "CNPC_EOC_MAM",
		"type": "effect_on_condition",
		"effect": [
			{"run_eocs":["CNPC_EOC_HitEocs"]}
		],
		"eoc_type": "EVENT",
		"required_event":"character_melee_attacks_monster"
	},
	{
		"id": "CNPC_EOC_RAC",
		"type": "effect_on_condition",
		"effect": [
			{"run_eocs":["CNPC_EOC_HitEocs"]}
		],
		"eoc_type": "EVENT",
		"required_event":"character_ranged_attacks_character"
	},
	{
		"id": "CNPC_EOC_RAM",
		"type": "effect_on_condition",
		"effect": [
			{"run_eocs":["CNPC_EOC_HitEocs"]}
		],
		"eoc_type": "EVENT",
		"required_event":"character_ranged_attacks_monster"
	}
]

saveStaticData('HitEvent',HitEvent);