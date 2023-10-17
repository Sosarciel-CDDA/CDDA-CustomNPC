"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEffectSpell = exports.genTriggerEffect = void 0;
const utils_1 = require("@zwa73/utils");
const ModDefine_1 = require("../ModDefine");
/**创建触发性效果 */
function genTriggerEffect(dm, effect, hook, eocEffects, duration, condition) {
    const neffect = utils_1.UtilFunc.deepClone(effect);
    neffect.int_decay_remove = true;
    const eocid = `${neffect.id}_Trigger`;
    const triggerEoc = (0, ModDefine_1.genActEoc)(eocid, [
        ...eocEffects,
        { u_add_effect: effect.id, intensity: { math: [`u_effect_intensity('${neffect.id}')-1`] }, duration },
        { run_eocs: {
                id: `${neffect.id}_Trigger`,
                eoc_type: "ACTIVATION",
                condition: { math: [`u_effect_intensity('${neffect.id}')`, "<=", "0"] },
                effect: [{ u_lose_effect: neffect.id }]
            } }
    ], { and: [{ u_has_effect: effect.id }, ...condition ? [condition] : []] }, true);
    dm.addEvent(hook, 0, triggerEoc);
    return [triggerEoc, neffect];
}
exports.genTriggerEffect = genTriggerEffect;
/**创建添加效果的法术 */
function genEffectSpell(spell, effectID, intensity, duration) {
    const eocid = `${spell.id}_AddEffect`;
    const nspell = utils_1.UtilFunc.deepClone(spell);
    nspell.effect = "effect_on_condition";
    nspell.effect_str = eocid;
    const effecteoc = (0, ModDefine_1.genActEoc)(eocid, [
        { u_add_effect: effectID, intensity, duration }
    ], undefined, true);
    return [nspell, effecteoc];
}
exports.genEffectSpell = genEffectSpell;
