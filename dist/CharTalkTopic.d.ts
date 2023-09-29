import { DataManager } from "./DataManager";
/**获取强化字段的变量ID */
export declare function getFieldVarID(charName: string, field: string): string;
export declare function createCharTalkTopic(dm: DataManager, charName: string): Promise<void>;
