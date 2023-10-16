import { DataManager } from "../DataManager";
/**可用的动画类型列表 */
export declare const AnimTypeList: readonly ["Idle", "Move", "Attack"];
/**动画类型 */
export type AnimType = typeof AnimTypeList[number];
/**生成某角色的动作id */
export declare function formatAnimName(charName: string, animType: AnimType): string;
/**创建动画辅助工具
 * @param charName 角色名
 */
export declare function createAnimTool(dm: DataManager, charName: string): Promise<void>;
