import { JArray, JObject } from "@zwa73/utils";



export type EOC = {
	type: "effect_on_condition";
	id: string;
	effect?: JArray;
	condition?: JObject;
};
