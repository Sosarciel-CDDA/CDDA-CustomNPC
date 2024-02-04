import { Spell, FlagID, WeaponCategoryID } from "cdda-schema";
import { CDataManager } from "../DataManager";
import { SpecEffect } from "./CharSkillSpecEffect";
import { CastAIData, Inherit } from "cdda-smartnpc";
/**角色技能 */
export type CharSkill = {
    /**施法AI */
    cast_ai: (Inherit | CastAIData);
    /**法术效果
     * 可用 `u_${字段}` 或 `${角色名}_${字段}` 表示 当前/某个角色 的字段变量
     * 如 min_damage: {math:["u_重击 * 10 + Asuna_重击"]}
     *
     * 可用 `u_${法术id}_cooldown` 获得对应技能冷却
     * 如 {math:["u_fireball_cooldown"]}
     *
     * 可用 u_coCooldown 获得公共冷却时间
     */
    spell: Spell;
    /**子法术
     * 将会随主spell一起解析
     * 作为spell的extra_effects加入
     */
    extra_effects?: Spell[];
    /**特殊的子效果 */
    spec_effect?: SpecEffect[];
    /**要求强化字段 [字段,强化等级] 或 字段名 */
    require_field?: [string, number] | string;
    /**需求的武器flag
     * 在角色配置中定义的 武器 会自动生成并添加同ID Flag
     */
    require_weapon_flag?: FlagID[];
    /**需求的武器分类 */
    require_weapon_category?: WeaponCategoryID[];
    /**需求无武器/完全徒手 */
    require_unarmed?: boolean;
};
/**处理角色技能 */
export declare function createCharSkill(dm: CDataManager, charName: string): Promise<void>;
/**解析NumObj为math表达式 */
export declare function parseNumObj(value: any): string;
