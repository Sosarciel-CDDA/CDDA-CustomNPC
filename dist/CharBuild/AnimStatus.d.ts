import { AnimType } from "./AnimTool";
import { CharDefineData, CDataManager } from "../DataManager";
import { Eoc } from "@sosarciel-cdda/sclema";
/**移除其他动作变异 */
export declare function removeOtherAnimEoc(charName: string, baseData: CharDefineData, animType: AnimType): Eoc | null;
/**切换动作EOC */
export declare function changeAnimEoc(charName: string, baseData: CharDefineData, animType: AnimType): Eoc[];
/**创建动画状态机事件 */
export declare function createAnimStatus(dm: CDataManager, charName: string): Promise<void>;
