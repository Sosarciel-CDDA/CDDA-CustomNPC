import { AnyItemID, EnchArmorValType, EnchGenericValType, EocEffect, Generic, Gun, MutationID, NpcGender, NumMathExp, NumObj, SkillID, StatusSimple } from "./CddaJsonFormat";
import { CharSkill } from "./CharSkill";
import { DataManager } from './DataManager';
/**动态读取的角色设定 */
export type CharConfig = {
    /**角色名 继承自哪个角色
     * 数组将会拼接
     * 对象将会合并
     * 简单量将会覆盖
     * 多个继承冲突时 排在前的将会覆盖排在后的
     */
    extends?: string[];
    /**是虚拟的/仅用于继承的 */
    virtual?: boolean;
    /**描述信息 */
    desc?: CharDesc;
    /**基础属性 */
    base_status?: Record<StatusSimple, number>;
    /**基础技能 */
    base_skill?: Partial<Record<SkillID | "ALL", number>>;
    /**附魔属性 */
    ench_status?: Partial<Record<EnchStat, number | NumMathExp>>;
    /**固定的武器 */
    weapon?: Gun | Generic;
    /**技能 */
    skill?: CharSkill[];
    /**强化项 */
    upgrade?: CharUpgrade[];
};
/**角色描述信息 */
export type CharDesc = {
    /**年龄 */
    age?: number;
    /**身高 */
    height?: number;
    /**性别 */
    gender?: NpcGender;
};
/**要求的资源 */
export type RequireResource = {
    /**物品ID */
    id: AnyItemID;
    /**需求数量 默认1 */
    count?: number;
    /**不会消耗 默认 false*/
    not_consume?: boolean;
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
     * 物品[等级][或][与]
     * 如在0升至1级时需要 10x魔力结晶与1x诱变剂 或 1x魔法水晶,1x诱变剂 如下
     * [
     * [[10x魔力结晶,1x诱变剂],[1x魔法水晶,1x诱变剂]]
     * ]
     */
    require_resource: (RequireResource | AnyItemID)[][][];
    /**每个强化等级提升的附魔属性 */
    lvl_ench_status?: Partial<Record<EnchStat, number | NumMathExp>>;
    /**只要拥有此字段就会添加的附魔属性 */
    ench_status?: Partial<Record<EnchStat, number | NumMathExp>>;
    /**到达特定强化等级时将会获得的变异
     * [拥有字段时获得的变异ID,[变异ID,强化等级],[第二个变异ID,强化等级]]
     */
    mutation?: ({
        id: MutationID;
        lvl: number;
    } | MutationID)[];
    /**对这个升级项的说明 */
    desc?: string;
    /**每次升级时将会应用的EocEffect
     * u是玩家 n是角色
     */
    effect?: EocEffect[];
};
/**变量属性 */
export type EnchStat = `${"add" | "multiply"}_${EnchGenericValType | EnchArmorValType}`;
/**变量属性表 */
export type EnchStatTable = Partial<Record<EnchStat, NumObj>>;
/**解析变量属性Obj */
export declare function parseEnchStat(stat: EnchStat): {
    category: "add" | "multiply";
    field: "ARMOR_ACID" | "ARMOR_BASH" | "ARMOR_BIO" | "ARMOR_BULLET" | "ARMOR_COLD" | "ARMOR_CUT" | "ARMOR_ELEC" | "ARMOR_HEAT" | "ARMOR_STAB" | "ATTACK_NOISE" | "ATTACK_SPEED" | "BIONIC_POWER" | "BONUS_BLOCK" | "BONUS_DODGE" | "CARRY_WEIGHT" | "COMBAT_CATCHUP" | "CLIMATE_CONTROL_HEAT" | "CLIMATE_CONTROL_CHILL" | "DEXTERITY" | "INTELLIGENCE" | "PERCEPTION" | "STRENGTH" | "SPEED" | "EFFECTIVE_HEALTH_MOD" | "EXTRA_ACID" | "EXTRA_BASH" | "EXTRA_BIO" | "EXTRA_BULLET" | "EXTRA_COLD" | "EXTRA_CUT" | "EXTRA_ELEC" | "EXTRA_HEAT" | "EXTRA_STAB" | "EXTRA_ELEC_PAIN" | "EVASION" | "FALL_DAMAGE" | "FATIGUE" | "FOOTSTEP_NOISE" | "FORCEFIELD" | "HUNGER" | "KNOCKBACK_RESIST" | "KNOCKDOWN_RESIST" | "LEARNING_FOCUS" | "LUMINATION" | "MAX_HP" | "MAX_MANA" | "MAX_STAMINA" | "MELEE_DAMAGE" | "RANGED_DAMAGE" | "METABOLISM" | "MOD_HEALTH" | "MOD_HEALTH_CAP" | "MOVE_COST" | "OVERKILL_DAMAGE" | "PAIN" | "PAIN_REMOVE" | "SHOUT_NOISE" | "SIGHT_RANGE_ELECTRIC" | "SIGHT_RANGE_NETHER" | "MOTION_VISION_RANGE" | "SLEEPY" | "SKILL_RUST_RESIST" | "SOCIAL_INTIMIDATE" | "SOCIAL_LIE" | "SOCIAL_PERSUADE" | "RANGE" | "READING_EXP" | "RECOIL_MODIFIER" | "REGEN_HP" | "REGEN_MANA" | "REGEN_STAMINA" | "THIRST" | "WEAPON_DISPERSION" | "ITEM_ARMOR_ACID" | "ITEM_ARMOR_BASH" | "ITEM_ARMOR_BIO" | "ITEM_ARMOR_BULLET" | "ITEM_ARMOR_COLD" | "ITEM_ARMOR_CUT" | "ITEM_ARMOR_ELEC" | "ITEM_ARMOR_HEAT" | "ITEM_ARMOR_STAB" | "ITEM_ATTACK_SPEED";
};
/**解析变量属性表 */
export declare function parseEnchStatTable(table?: EnchStatTable): StatModVal[];
/**变量属性专用的增幅 */
type StatModVal = {
    /**附魔增幅类型 */
    value: EnchGenericValType | EnchArmorValType;
    /**倍率增幅 1为+100% */
    multiply?: NumMathExp;
    /**加值增幅 在计算倍率前先添加 */
    add?: NumMathExp;
};
/**获取全局的强化字段的变量ID */
export declare function getGlobalFieldVarID(charName: string, field: string): string;
export declare function getTalkerFieldVarID(talker: "u" | "n", field: string): string;
/**读取某个角色的CharConfig */
export declare function loadCharConfig(dm: DataManager, charName: string): Promise<CharConfig>;
export {};
