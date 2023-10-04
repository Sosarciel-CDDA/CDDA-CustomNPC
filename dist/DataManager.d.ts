import { JArray, JToken } from '@zwa73/utils';
import { AnimType } from './AnimTool';
import { Eoc, MutationID, ItemGroupID, NpcClassID, NpcInstanceID, FlagID, ArmorID, GunID, StatusSimple, EnchantmentID, Gun, Generic, GenericID, EnchArmorValType, EnchGenericValType, EocEffect, AnyCddaJson, AnyItemID } from './CddaJsonFormat';
import { CharSkill } from './CharSkill';
import { SkillID } from './CddaJsonFormat/Skill';
import { TalkTopicID } from './CddaJsonFormat/TalkTopic';
/**角色事件列表 */
export declare const CharEvemtTypeList: readonly ["CharIdle", "CharMove", "CharCauseHit", "CharUpdate", "CharCauseMeleeHit", "CharCauseRangeHit", "CharInit", "CharTakeDamage", "CharTakeRangeDamage", "CharTakeMeleeDamage", "CharBattleUpdate", "CharDeath"];
/**角色事件类型 */
export type CharEventType = typeof CharEvemtTypeList[number];
/**反转Talker的角色事件列表
 * 对应同名CauseDamage
 * npc为角色
 */
export declare const ReverseCharEvemtTypeList: readonly ["CharCauseDamage", "CharCauseMeleeDamage", "CharCauseRangeDamage"];
/**反转Talker的角色事件类型
 * 对应同名CauseDamage
 */
export type ReverseCharEventType = typeof ReverseCharEvemtTypeList[number];
/**全局事件列表 */
export declare const GlobalEvemtTypeList: readonly ["PlayerUpdate", "CharIdle", "CharMove", "CharCauseHit", "CharUpdate", "CharCauseMeleeHit", "CharCauseRangeHit", "CharInit", "CharTakeDamage", "CharTakeRangeDamage", "CharTakeMeleeDamage", "CharBattleUpdate", "CharDeath", "CharCauseDamage", "CharCauseMeleeDamage", "CharCauseRangeDamage"];
/**全局事件 */
export type GlobalEventType = typeof GlobalEvemtTypeList[number];
/**事件效果 */
export type EventEffect = {
    /**eoc效果 */
    effect: EocEffect;
    /**排序权重 */
    weight: number;
};
/**变量属性 */
export type EnchStat = EnchGenericValType | EnchArmorValType;
/**动态读取的角色设定 */
export type CharConfig = {
    /**基础属性 */
    base_status: Record<StatusSimple, number>;
    /**基础技能 */
    base_skill?: Partial<Record<SkillID | "ALL", number>>;
    /**附魔属性 */
    ench_status?: Partial<Record<EnchStat, number>>;
    /**固定的武器 */
    weapon: Gun | Generic;
    /**技能 */
    skill?: CharSkill[];
    /**强化项 */
    upgrade?: CharUpgrade[];
};
/**角色强化项 */
export type CharUpgrade = {
    /**强化项ID
     * 作为全局变量`${charName}_${fieled}`
     */
    field: string;
    /**最大强化等级 未设置则为require_resource长度
     * 若 require_resource 设置的长度不足以达到最大等级
     * 则以最后一组材料填充剩余部分
     */
    max_lvl?: number;
    /**所需要消耗的资源
     * [[[一级的物品ID,数量],[一级的另一个物品ID,数量]]
     * [[二级的物品ID,数量],[二级的另一个物品ID,数量]]]
     */
    require_resource: ([AnyItemID, number] | AnyItemID)[][];
    /**每个强化等级提升的附魔属性 */
    lvl_ench_status?: Partial<Record<EnchStat, number>>;
    /**只要拥有此字段就会添加的附魔属性 */
    ench_status?: Partial<Record<EnchStat, number>>;
    /**到达特定强化等级时将会获得的变异
     * [拥有字段时获得的变异ID,[变异ID,强化等级],[第二个变异ID,强化等级]]
     */
    mutation?: ([MutationID, number] | MutationID)[];
};
/**角色基础数据 */
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
    vaildAnim: AnimType[];
    /**基础装备ID */
    baseArmorID: ArmorID;
    /**基础装备附魔ID */
    baseEnchID: EnchantmentID;
    /**基础武器ID */
    baseWeaponID: GunID | GenericID;
    /**基础武器物品组ID */
    baseWeaponGroupID: ItemGroupID;
    /**基础武器Flag ID */
    baseWeaponFlagID: FlagID;
    /**经验变量ID */
    expVarID: string;
    /**主对话ID */
    talkTopicID: TalkTopicID;
}>;
/**主资源表 */
export type DataTable = {
    /**输出的角色数据表 */
    charTable: Record<string, {
        /**角色基础定义数据 */
        defineData: CharDefineData;
        /**输出数据 */
        outData: Record<string, JArray>;
        /**输出的角色Eoc事件 u为角色 npc为未定义
         * id为 `${charName}_${etype}`
         */
        charEventEocs: Record<CharEventType, EventEffect[]>;
        /**输出的对象反转的角色Eoc事件 u为目标 npc为角色
         * id为 `${charName}_${etype}`
         */
        reverseCharEventEocs: Record<ReverseCharEventType, EventEffect[]>;
        /**角色设定 */
        charConfig: CharConfig;
    }>;
    /**输出的静态数据表 */
    staticTable: Record<string, JArray>;
    /**输出的Eoc事件 */
    eventEocs: Record<GlobalEventType, EventEffect[]>;
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
export declare class DataManager {
    /**资源目录 */
    dataPath: string;
    /**输出目录 */
    outPath: string;
    /**角色目录 */
    charPath: string;
    /**角色列表 */
    charList: string[];
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
    processGfxpack(): Promise<void>;
    /**初始化 处理音效包 */
    processSoundpack(): Promise<void>;
    /**载入所有json */
    processJson(): Promise<void>;
    /**获取角色表 如无则初始化 */
    getCharData(charName: string): Promise<{
        /**角色基础定义数据 */
        defineData: Readonly<{
            /**角色名 */
            charName: string;
            /**基础变异ID 角色必定会拥有此变异 可以作为角色判断依据 */
            baseMutID: MutationID;
            /**职业ID */
            classID: NpcClassID;
            /**实例ID */
            instanceID: NpcInstanceID;
            /**动画数据 */
            animData: Record<"Idle" | "Move" | "Attack", Readonly<{
                /**动画类型 */
                animType: "Idle" | "Move" | "Attack";
                /**动画名 */
                animName: string;
                /**动画变异ID */
                mutID: MutationID;
                /**动画装备ID */
                armorID: ArmorID;
                /**动画装备物品组ID */
                itemGroupID: ItemGroupID;
            }>>;
            /**有效的动作动画 */
            vaildAnim: ("Idle" | "Move" | "Attack")[];
            /**基础装备ID */
            baseArmorID: ArmorID;
            /**基础装备附魔ID */
            baseEnchID: EnchantmentID;
            /**基础武器ID */
            baseWeaponID: `${string}SchemaString` | `GENERIC_${string}` | `${string}_GENERIC_${string}` | `GUN_${string}` | `${string}_GUN_${string}`;
            /**基础武器物品组ID */
            baseWeaponGroupID: ItemGroupID;
            /**基础武器Flag ID */
            baseWeaponFlagID: FlagID;
            /**经验变量ID */
            expVarID: string;
            /**主对话ID */
            talkTopicID: TalkTopicID;
        }>;
        /**输出数据 */
        outData: Record<string, JArray>;
        /**输出的角色Eoc事件 u为角色 npc为未定义
         * id为 `${charName}_${etype}`
         */
        charEventEocs: Record<"CharIdle" | "CharMove" | "CharCauseHit" | "CharUpdate" | "CharCauseMeleeHit" | "CharCauseRangeHit" | "CharInit" | "CharTakeDamage" | "CharTakeRangeDamage" | "CharTakeMeleeDamage" | "CharBattleUpdate" | "CharDeath", EventEffect[]>;
        /**输出的对象反转的角色Eoc事件 u为目标 npc为角色
         * id为 `${charName}_${etype}`
         */
        reverseCharEventEocs: Record<"CharCauseDamage" | "CharCauseMeleeDamage" | "CharCauseRangeDamage", EventEffect[]>;
        /**角色设定 */
        charConfig: CharConfig;
    }>;
    /**添加 eoc的ID引用到 全局事件
     * u为主角 npc为未定义
     */
    addEvent(etype: GlobalEventType, weight: number, ...events: Eoc[]): void;
    /**添加 eoc的ID引用到 角色事件
     * u为角色 npc为未定义
     */
    addCharEvent(charName: string, etype: CharEventType, weight: number, ...events: Eoc[]): void;
    /**添加 eoc的ID引用到 反转角色事件
     * u为目标 npc为角色
     */
    addReverseCharEvent(charName: string, etype: ReverseCharEventType, weight: number, ...events: Eoc[]): void;
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
