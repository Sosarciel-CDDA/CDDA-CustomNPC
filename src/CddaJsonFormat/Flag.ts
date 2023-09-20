import { CddaID } from "./GenericDefine";





/**Flag ID格式
 */
export type FlagID = CddaID<"FLAG">;

/**一个自定义的Flag */
export type Flag={
    type: "json_flag";
    id: FlagID;
}