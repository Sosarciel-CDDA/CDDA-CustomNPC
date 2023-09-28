import { AnimType } from "./AnimTool";
import { CharDefineData, DataManager } from "./DataManager";
import { Eoc } from "./CddaJsonFormat";
/**移除其他动作变异 */
export declare function removeOtherAnimEoc(baseData: CharDefineData, animType: AnimType): Eoc | null;
/**切换动作EOC */
export declare function changeAnimEoc(baseData: CharDefineData, animType: AnimType): Eoc[];
/**创建动画状态机 */
export declare function createAnimStatus(dm: DataManager, charName: string): Promise<void>;
