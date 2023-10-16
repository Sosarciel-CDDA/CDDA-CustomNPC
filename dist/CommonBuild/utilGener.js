"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEffectSpell = exports.genTriggerEffect = void 0;
const utils_1 = require("@zwa73/utils");
const ModDefine_1 = require("../ModDefine");
/**创建触发性效果 */
function genTriggerEffect(dm, effect, hook, eocEffects) {
    const eocid = `${effect.id}_Trigger`;
    const tiggerEoc = (0, ModDefine_1.genActEoc)(eocid, [
        ...eocEffects
    ], undefined, true);
}
exports.genTriggerEffect = genTriggerEffect;
/**创建添加效果的法术 */
function genEffectSpell(spell, effectID, intensity = 1, duration = 0) {
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
