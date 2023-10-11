import { CddaID } from "./GenericDefine";





/**定义的地块附着物 列表 */
export const DefineFieldIDList = [
    "fd_null",//无附着物
] as const;
/**定义的地块附着物 */
export type DefineFieldID = typeof DefineFieldIDList[number];

/**地块附着物ID  
 */
export type FieldID = CddaID<"FD">|DefineFieldID;