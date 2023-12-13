import { DataManager } from "../DataManager";
import { BoolObj, DamageTypeID, EffectID, EocEffect, NumObj, ParamsEoc, Spell, Time } from "cdda-schema";
import { CharSkill } from "./CharSkill";
/**子项数据 */
export type SpecSkillCastData = Readonly<{
    /**技能 */
    skill: CharSkill;
    /**基础成功eoc效果 */
    TEffect: EocEffect[];
    /**基础准备释放Eoc */
    PreEffect: EocEffect[];
    /**子法术 */
    extraEffects: Spell[];
}>;
/**添加效果 */
type AddEffect = {
    /**生成一个添加效果的子法术 */
    type: "AddEffect";
    /**效果ID */
    effect_id: EffectID;
    /**效果强度 */
    intensity: (NumObj);
    /**持续时间 数字为秒 */
    duration: (Time) | NumObj;
    /**添加效果后的额外效果 */
    effect?: EocEffect[];
    /**是否叠加强度 默认覆盖 */
    is_stack?: boolean;
};
/**以受害者为 u_ 运行EOC */
type RunEoc = {
    /**生成一个运行的子法术 */
    type: "RunEoc";
    /**运行的Eoc */
    eoc: (ParamsEoc);
    /**自动生成eoc并运行 */
    effect?: EocEffect[];
    /**自动生成的eoc的运行条件 */
    condition?: (BoolObj);
};
/**额外造成某种类型的伤害 */
type ExtDamage = {
    /**额外伤害 */
    type: "ExtDamage";
    /**伤害量 */
    amount: (NumObj);
    /**伤害类型id */
    damage_type: DamageTypeID;
};
/**特殊的字效果 */
export type SpecEffect = RunEoc | AddEffect | ExtDamage;
/**特殊效果的处理表 */
export declare const SpecProcMap: Record<SpecEffect["type"], (dm: DataManager, charName: string, baseSkillData: SpecSkillCastData, spec: SpecEffect, index: number) => void>;
export {};
