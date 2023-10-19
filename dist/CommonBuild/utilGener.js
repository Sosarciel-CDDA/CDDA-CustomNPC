"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAddEffEoc = exports.genTriggerEffect = void 0;
const ModDefine_1 = require("../ModDefine");
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
function genTriggerEffect(dm, effect, hook, eocEffects, duration, condition, cooldown = 0) {
    if (typeof cooldown == "number")
        cooldown = `${cooldown} s`;
    effect.int_decay_remove = true;
    const timevarId = `${effect.id}_Timer`;
    const eocid = `${effect.id}_Trigger`;
    const triggerEoc = (0, ModDefine_1.genActEoc)(eocid, [
        ...eocEffects,
        { u_add_var: timevarId, time: true },
        { run_eocs: {
                id: `${eocid}_sub`,
                eoc_type: "ACTIVATION",
                condition: { math: [`u_effect_intensity('${effect.id}')`, "<=", "1"] },
                effect: [{ u_lose_effect: effect.id }],
                false_effect: [
                    { u_add_effect: effect.id, intensity: { math: [`u_effect_intensity('${effect.id}')-1`] }, duration },
                ]
            } }
    ], { and: [
            { u_has_effect: effect.id },
            { or: [
                    { u_compare_time_since_var: timevarId, op: ">=", time: cooldown },
                    { not: { u_has_var: timevarId, time: true } },
                ] },
            ...condition ? [condition] : []
        ]
    }, true);
    dm.addEvent(hook, 0, triggerEoc);
    return triggerEoc;
}
exports.genTriggerEffect = genTriggerEffect;
/**创建添加效果的Eoc
 * EocID为 `${effect.id}_AddEffect`
 * 添加层数为 全局变量 `${effect.id}_count`
 * @param effectID 效果ID
 * @param duration 持续时间
 * @param eocEffects 额外效果
 */
function genAddEffEoc(effectID, duration, eocEffects) {
    const eocid = `${effectID}_AddEffect`;
    const effecteoc = (0, ModDefine_1.genActEoc)(eocid, [
        { u_add_effect: effectID, intensity: { math: [`${effectID}_count`] }, duration },
        ...eocEffects ?? []
    ], undefined, true);
    return effecteoc;
}
exports.genAddEffEoc = genAddEffEoc;
