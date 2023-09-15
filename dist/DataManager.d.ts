import { JArray, JObject, JToken } from '@zwa73/utils';
import { AnimType } from './AnimTool';
import { EOC } from './CddaJsonFormat/EOC';
/**事件列表 */
export declare const EvemtTypeList: readonly ["CharIdle", "CharMove", "CharCauseHit", "CharUpdate"];
/**事件类型 */
export type EventType = typeof EvemtTypeList[number];
/**主资源表 */
export type DataTable = {
    /**输出的角色数据表 */
    charTable: Record<string, {
        /**角色基础数据 */
        baseData: CharData;
        /**输出数据 */
        outData: Record<string, JArray>;
    }>;
    /**输出的静态数据表 */
    staticTable: Record<string, JObject>;
    /**输出的Eoc事件 */
    eventEocs: Record<EventType, EOC>;
};
export declare class DataManager {
    /**资源目录 */
    dataPath: string;
    /**输出目录 */
    outPath: string;
    /**角色目录 */
    charPath: string;
    /**角色列表 */
    charList: string[];
    /**主资源表 */
    private dataTable;
    constructor(outPath?: string, dataPath?: string);
    /**获取角色表 如无则初始化 */
    getCharData(charName: string): {
        /**角色基础数据 */
        baseData: Readonly<{
            /**角色名 */
            charName: string;
            /**基础变异ID */
            baseMutID: string;
            /**职业ID */
            classID: string;
            /**实例ID */
            instanceID: string;
            /**动画数据 */
            animData: Record<"Idle" | "Move" | "Attack", Readonly<{
                /**动画类型 */
                animType: "Idle" | "Move" | "Attack";
                /**动画名 */
                animName: string;
                /**动画变异ID */
                mutID: string;
                /**动画装备ID */
                armorID: string;
                /**动画装备物品组ID */
                itemGroupID: string;
            }>>;
            /**有效的动作 */
            vaildAnim: ("Idle" | "Move" | "Attack")[];
            /**基础装备ID */
            baseArmorID: string;
            /**基础武器ID */
            baseWeaponID: string;
            /**基础弹药ID */
            baseAmmoID: string;
            /**基础弹药类型ID */
            baseAmmoTypeID: string;
            /**基础武器物品组ID */
            baseWeaponGroupID: string;
        }>;
        /**输出数据 */
        outData: Record<string, JArray>;
    };
    /**添加事件 */
    addEvent(etype: EventType, ...events: EOC[]): void;
    /**获取 角色目录 */
    getCharPath(charName: string): string;
    /**获取 角色图片目录 */
    getCharImagePath(charName: string): string;
    /**获取 输出角色目录 */
    getOutCharPath(charName: string): string;
    /**输出数据到角色目录 */
    saveToCharFile(charName: string, filePath: string, obj: JToken): Promise<void>;
    /**输出数据到主目录 */
    saveToFile(filePath: string, obj: JToken): Promise<void>;
    /**输出数据 */
    saveAllData(): Promise<void>;
}
/**角色基础数据 */
export type CharData = Readonly<{
    /**角色名 */
    charName: string;
    /**基础变异ID */
    baseMutID: string;
    /**职业ID */
    classID: string;
    /**实例ID */
    instanceID: string;
    /**动画数据 */
    animData: Record<AnimType, AnimData>;
    /**有效的动作 */
    vaildAnim: AnimType[];
    /**基础装备ID */
    baseArmorID: string;
    /**基础武器ID */
    baseWeaponID: string;
    /**基础弹药ID */
    baseAmmoID: string;
    /**基础弹药类型ID */
    baseAmmoTypeID: string;
    /**基础武器物品组ID */
    baseWeaponGroupID: string;
}>;
/**动画数据 */
export type AnimData = Readonly<{
    /**动画类型 */
    animType: AnimType;
    /**动画名 */
    animName: string;
    /**动画变异ID */
    mutID: string;
    /**动画装备ID */
    armorID: string;
    /**动画装备物品组ID */
    itemGroupID: string;
}>;
