import { CharConfig } from "./CharInterface";
/**获取角色配置文件 */
export declare const getCharConfig: (charName: string) => Promise<CharConfig>;
/**获取角色列表 */
export declare const getCharList: () => Promise<string[]>;
