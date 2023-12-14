import { DataManager } from "../DataManager";
import { Armor, BoolObj, DamageInfoOrder, DamageType, Eoc, EocEffect, Mutation, Time, Effect, EffectID } from "cdda-schema";
import { CGlobalHook } from "../CnpcEvent";
/**修改效果为触发性效果, 并创建触发Eoc
 * EocID为 `${effect.id}_Trigger`
 * @param dm 管理器
 * @param effect 效果实例
 * @param hook 触发时机
 * @param mode 衰减类型
 * @param eocEffects 触发衰减前的效果
 * @param duration 触发后重置的持续时间
 * @param condition 触发条件
 * @param cooldown 触发间隔
 */
export declare function genTriggerEffect(dm: DataManager, effect: Effect, hook: CGlobalHook, mode: "/2" | "-1" | "none", eocEffects: EocEffect[], duration: (Time), condition?: (BoolObj), cooldown?: (Time)): Eoc;
/**创建添加效果的Eoc
 * EocID为 `${effect.id}_AddEffect`
 * 添加层数为 全局变量 `${effect.id}_count`
 * @param effectID 效果ID
 * @param duration 持续时间
 * @param eocEffects 额外效果
 */
export declare function genAddEffEoc(effectID: EffectID, duration: (Time), eocEffects?: EocEffect[]): Eoc;
/**修改护甲 并生成添加护甲的变异
 * ID为`${armor.id}_MUT`
 */
export declare function genArmorMut(armor: Armor): Mutation;
/**根据伤害生成一个DamageInfoOrder */
export declare function genDIO(dt: DamageType): DamageInfoOrder;
