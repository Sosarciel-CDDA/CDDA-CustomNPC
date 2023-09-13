import { JArray, JObject } from "@zwa73/utils";
/**生成适用于此mod的 EOC ID */
export declare function genEOCID(id: string): string;
export type EOC = {
    type: "effect_on_condition";
    id: string;
    effect?: JArray;
    condition?: JObject;
};
