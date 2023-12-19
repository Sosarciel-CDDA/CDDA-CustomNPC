import { JArray, JObject, JToken } from '@zwa73/utils';
import { Eoc, MutationID, ItemGroupID, NpcClassID, NpcInstanceID, FlagID, ArmorID, EnchantmentID, GenericID, AnyCddaJson, TalkTopicID, Resp } from 'cdda-schema';
import { CharConfig, AnimType } from './CharBuild';
import { CCharHook, EventEffect, CGlobalHook } from "./CnpcEvent";
/**角色定义数据 */
export type CharDefineData = Readonly<{
    /**角色名 */
    charName: string;
    /**基础变异ID 角色必定会拥有此变异 可以作为角色判断依据 */
    baseMutID: MutationID;
    /**职业ID */
    classID: NpcClassID;
    /**实例ID */
    instanceID: NpcInstanceID;
    /**动画数据 */
    animData: Record<AnimType, AnimData>;
    /**有效的动作动画 */
    validAnim: AnimType[];
    /**基础装备ID */
    baseArmorID: ArmorID;
    /**基础装备附魔ID */
    baseEnchID: EnchantmentID;
    /**基础武器FlagID 用于分辨是否为角色专用物品 */
    baseItemFlagID: FlagID;
    /**基础背包物品组 */
    baseCarryGroup: ItemGroupID;
    /**主对话ID */
    talkTopicID: TalkTopicID;
    /**卡片ID */
    cardID: GenericID;
    /**控制施法的Resp */
    castResp: Resp[];
}>;
/**角色数据 */
type CharData = {
    /**角色基础定义数据 */
    defineData: CharDefineData;
    /**输出数据 */
    outData: Record<string, JArray>;
    /**输出的角色Eoc事件 u为角色 npc为未定义
     * id为 `${charName}_${etype}`
     */
    charEventEocs: Record<CCharHook, EventEffect[]>;
    /**角色设定 */
    charConfig: CharConfig;
};
/**主资源表 */
export type DataTable = {
    /**输出的角色数据表 */
    charTable: Record<string, CharData>;
    /**输出的静态数据表 */
    staticTable: Record<string, JArray>;
    /**输出的Eoc事件 */
    eventEocs: Record<CGlobalHook, EventEffect[]>;
    /**共用资源表 */
    sharedTable: Record<string, Record<string, JObject>>;
};
/**build配置 */
export type BuildSetting = {
    /**游戏目录 */
    game_path: string;
    /**游戏贴图包目录名 */
    target_gfxpack: string;
    /**游戏音效包目录名 */
    target_soundpack: string;
};
/**游戏数据 */
export type GameData = {
    /**贴图包ID */
    gfx_name?: string;
    /**JSON */
    game_json?: CddaJson;
};
/**数据管理器 */
export declare class DataManager {
    /**资源目录 */
    dataPath: string;
    /**输出目录 */
    outPath: string;
    /**角色目录 */
    charPath: string;
    /**角色列表 */
    charList: string[];
    /**虚拟角色列表 */
    virtualCharList: string[];
    /**build设置 */
    buildSetting: BuildSetting;
    /**游戏数据 */
    gameData: GameData;
    /**主资源表 */
    private dataTable;
    /**
     * @param dataPath 输入数据路径
     * @param outPath  输出数据路径
     */
    private constructor();
    /**静态构造函数
     * @param dataPath 输入数据路径
     * @param outPath  输出数据路径
     */
    static create(dataPath?: string, outPath?: string): Promise<DataManager>;
    /**初始化 处理贴图包 */
    private processGfxpack;
    /**初始化 处理音效包 */
    private processSoundpack;
    /**载入所有json */
    private processJson;
    /**获取角色表 如无则初始化 */
    getCharData(charName: string): Promise<CharData>;
    /**添加 eoc的ID引用到 全局事件
     * u为主角 npc为未定义
     */
    addEvent(etype: CGlobalHook, weight: number, ...events: Eoc[]): void;
    /**添加 eoc的ID引用到 角色事件
     * u为角色 npc为未定义
     */
    addCharEvent(charName: string, etype: CCharHook, weight: number, ...events: Eoc[]): void;
    /**获取 角色目录 */
    getCharPath(charName: string): string;
    /**获取 输出角色目录 */
    getOutCharPath(charName: string): string;
    /**添加共享资源 同filepath+key会覆盖 出现与原数据不同的数据时会提示 */
    addSharedRes(key: string, val: JObject, filePath: string, ...filePaths: string[]): void;
    /**添加静态资源 */
    addStaticData(arr: JObject[], filePath: string, ...filePaths: string[]): void;
    /**输出数据到角色目录 */
    saveToCharFile(charName: string, filePath: string, obj: JToken): Promise<void>;
    /**输出数据到主目录 */
    saveToFile(filePath: string, obj: JToken): Promise<void>;
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
export {};
