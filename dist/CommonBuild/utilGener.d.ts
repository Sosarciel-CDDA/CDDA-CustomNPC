import { Effect, EffectID } from "../CddaJsonFormat/Effect";
import { DataManager } from "../DataManager";
import { BoolObj, Eoc, EocEffect, Time } from "../CddaJsonFormat";
import { CommonEventType } from "../Event";
/**修改效果为触发性效果, 并创建触发Eoc
 * EocID为 `${effect.id}_Trigger`
 * @param dm 管理器
 * @param effect 效果实例
 * @param hook 触发时机
 * @param eocEffects 触发效果
 * @param duration 触发后重置的持续时间
 * @param condition 触发条件
 * @param cooldown 触发间隔
 */
export declare function genTriggerEffect(dm: DataManager, effect: Effect, hook: CommonEventType, eocEffects: EocEffect[], duration: Time, condition?: BoolObj, cooldown?: Time): Eoc;
/**创建添加效果的Eoc
 * EocID为 `${effect.id}_AddEffect`
 * 添加层数为 全局变量 `${effect.id}_count`
 * @param effectID 效果ID
 * @param duration 持续时间
 * @param eocEffects 额外效果
 */
export declare function genAddEffEoc(effectID: EffectID, duration: Time, eocEffects?: EocEffect[]): Eoc;
