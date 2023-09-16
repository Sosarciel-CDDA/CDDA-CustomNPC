import { JArray, JObject, JToken } from '@zwa73/utils';
import { AnimType } from './AnimTool';
import { Eoc } from './CddaJsonFormat/EOC';
import { MutationID } from './CddaJsonFormat/Mutattion';
import { ItemGroupID } from './CddaJsonFormat/ItemGroup';
import { NpcClassID } from './CddaJsonFormat/NpcClass';
import { NpcInstanceID } from './CddaJsonFormat/NpcInstance';
import { FlagID } from './CddaJsonFormat/Flag';
import { AmmiunitionTypeID } from './CddaJsonFormat/AmmiunitionType';
import { AmmoID, ArmorID, GunID } from './CddaJsonFormat/Item';
/**角色事件列表 */
export declare const CharEvemtTypeList: readonly ["CharIdle", "CharMove", "CharCauseHit", "CharUpdate", "CharCauseMeleeHit", "CharCauseRangeHit"];
/**角色事件类型 */
export type CharEventType = typeof CharEvemtTypeList[number];
/**全局事件列表 */
export declare const GlobalEvemtTypeList: readonly ["PlayerUpdate", "CharIdle", "CharMove", "CharCauseHit", "CharUpdate", "CharCauseMeleeHit", "CharCauseRangeHit"];
/**全局事件 */
export type GlobalEventType = typeof GlobalEvemtTypeList[number];
/**主资源表 */
export type DataTable = {
    /**输出的角色数据表 */
    charTable: Record<string, {
        /**角色基础数据 */
        baseData: CharData;
        /**输出数据 */
        outData: Record<string, JArray>;
        /**输出的角色Eoc事件 */
        charEventEocs: Record<CharEventType, Eoc>;
    }>;
    /**输出的静态数据表 */
    staticTable: Record<string, JObject>;
    /**输出的Eoc事件 */
    eventEocs: Record<GlobalEventType, Eoc>;
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
            baseMutID: `${string}_MUT_${string}`;
            /**职业ID */
            classID: `${string}_NPCLASS_${string}`;
            /**实例ID */
            instanceID: `${string}_NPC_${string}`;
            /**动画数据 */
            animData: Record<"Idle" | "Move" | "Attack", Readonly<{
                /**动画类型 */
                animType: "Idle" | "Move" | "Attack";
                /**动画名 */
                animName: string;
                /**动画变异ID */
                mutID: `${string}_MUT_${string}`;
                /**动画装备ID */
                armorID: `${string}_ARMOR_${string}`;
                /**动画装备物品组ID */
                itemGroupID: `${string}_ITEMGROUP_${string}`;
            }>>;
            /**有效的动作 */
            vaildAnim: ("Idle" | "Move" | "Attack")[];
            /**基础装备ID */
            baseArmorID: `${string}_ARMOR_${string}`;
            /**基础武器ID */
            baseWeaponID: `${string}_GUN_${string}`;
            /**基础弹药ID */
            baseAmmoID: `${string}_AMMO_${string}`;
            /**基础弹药类型ID */
            baseAmmoTypeID: `${string}_AMMITYPE_${string}`;
            /**基础武器物品组ID */
            baseWeaponGroupID: `${string}_ITEMGROUP_${string}`;
            /**基础武器Flag ID */
            baseWeaponFlagID: `${string}_FLAG_${string}`;
        }>;
        /**输出数据 */
        outData: Record<string, JArray>;
        /**输出的角色Eoc事件 */
        charEventEocs: Record<"CharIdle" | "CharMove" | "CharCauseHit" | "CharUpdate" | "CharCauseMeleeHit" | "CharCauseRangeHit", Eoc>;
    };
    /**添加事件 */
    addEvent(etype: GlobalEventType, ...events: Eoc[]): void;
    /**添加角色事件 */
    addCharEvent(charName: string, etype: CharEventType, ...events: Eoc[]): void;
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
    baseMutID: MutationID;
    /**职业ID */
    classID: NpcClassID;
    /**实例ID */
    instanceID: NpcInstanceID;
    /**动画数据 */
    animData: Record<AnimType, AnimData>;
    /**有效的动作 */
    vaildAnim: AnimType[];
    /**基础装备ID */
    baseArmorID: ArmorID;
    /**基础武器ID */
    baseWeaponID: GunID;
    /**基础弹药ID */
    baseAmmoID: AmmoID;
    /**基础弹药类型ID */
    baseAmmoTypeID: AmmiunitionTypeID;
    /**基础武器物品组ID */
    baseWeaponGroupID: ItemGroupID;
    /**基础武器Flag ID */
    baseWeaponFlagID: FlagID;
}>;
/**动画数据 */
export type AnimData = Readonly<{
    /**动画类型 */
    animType: AnimType;
    /**动画名 */
    animName: string;
    /**动画变异ID */
    mutID: MutationID;
    /**动画装备ID */
    armorID: ArmorID;
    /**动画装备物品组ID */
    itemGroupID: ItemGroupID;
}>;
