import { AnimType } from "./AnimTool";
import { CharDefineData, DataManager } from "../DataManager";
import { Eoc } from "cdda-schema";
/**移除其他动作变异 */
export declare function removeOtherAnimEoc(charName: string, baseData: CharDefineData, animType: AnimType): Eoc | null;
/**切换动作EOC */
export declare function changeAnimEoc(charName: string, baseData: CharDefineData, animType: AnimType): Eoc[];
/**创建动画状态机事件 */
export declare function createAnimStatus(dm: DataManager, charName: string): Promise<void>;
