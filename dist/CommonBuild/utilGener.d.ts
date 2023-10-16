import { Effect, EffectID } from "../CddaJsonFormat/Effect";
import { DataManager } from "../DataManager";
import { Eoc, EocEffect, Spell, Time } from "../CddaJsonFormat";
import { GlobalEventType } from "../Event";
/**创建触发性效果 */
export declare function genTriggerEffect(dm: DataManager, effect: Effect, hook: GlobalEventType, eocEffects: EocEffect[]): void;
/**创建添加效果的法术 */
export declare function genEffectSpell(spell: Omit<Spell, "effect_str" | "effect">, effectID: EffectID, intensity?: number, duration?: Time): (Eoc | Spell)[];
