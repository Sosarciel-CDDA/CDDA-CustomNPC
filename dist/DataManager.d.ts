import { JObject } from '@zwa73/utils';
import { Eoc, AnyCddaJson } from 'cdda-schema';
import { CharHook, DataManager } from 'cdda-event';
/**数据管理器 */
export declare class CDataManager extends DataManager {
    constructor();
    /**添加 eoc的ID引用到 */
    addCharInvokeEoc(charName: string, etype: CharHook, weight: number, ...events: Eoc[]): void;
    /**添加角色静态资源 */
    addCharStaticData(charName: string, arr: JObject[], filePath: string, ...filePaths: string[]): void;
    /**输出数据 */
    saveAllData(): Promise<void>;
}
/**所有json的表 */
export declare class CddaJson {
    private readonly _table;
    private readonly _jsonList;
    private constructor();
    static create(game_path: string): Promise<CddaJson>;
    getJson(type: string, id: string): AnyCddaJson | undefined;
    jsonList(): readonly AnyCddaJson[];
}
