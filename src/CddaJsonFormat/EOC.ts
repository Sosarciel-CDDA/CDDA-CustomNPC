import { MOD_PREFIX } from "@src/DataManager";
import { JArray, JObject } from "@zwa73/utils";

/**生成适用于此mod的 EOC ID */
export function genEOCID(id: string) {
	return `${MOD_PREFIX}_NPC_${id}`;
}

export type EOC = {
	type: "effect_on_condition";
	id: string;
	effect?: JArray;
	condition?: JObject;
};
