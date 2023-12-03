"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecProcMap = void 0;
const CharSkill_1 = require("./CharSkill");
const ModDefine_1 = require("../ModDefine");
const StaticData_1 = require("../StaticData");
/**特殊效果的处理表 */
exports.SpecProcMap = {
    AddEffect: processAddEffect,
    RunEoc: processRunEoc,
    ExtDamage: processExtDamage,
};
function processAddEffect(dm, charName, baseSkillData, spec, index) {
    const { skill, TEffect, PreEffect, extraEffects } = baseSkillData;
    const { spell, one_in_chance } = skill;
    spec = spec;
    const mainid = `${spell.id}_${index}_AddEffect`;
    const intVar = `${mainid}_intensity`;
    PreEffect.push({ math: [intVar, "=", (0, CharSkill_1.parseNumObj)(spec.intensity)] });
    let fixdur = spec.duration;
    if (typeof fixdur != "string" && typeof fixdur != "number") {
        const durVar = `${mainid}_duration`;
        PreEffect.push({ math: [durVar, "=", (0, CharSkill_1.parseNumObj)(fixdur)] });
        fixdur = { math: [durVar] };
    }
    const addEoc = {
        type: "effect_on_condition",
        id: (0, ModDefine_1.genEOCID)(mainid),
        eoc_type: "ACTIVATION",
        effect: [
            spec.is_stack == true
                ? { u_add_effect: spec.effect_id, duration: fixdur, intensity: { math: [`max(u_effect_intensity('${spec.effect_id}'),0) + ${intVar}`] } }
                : { u_add_effect: spec.effect_id, duration: fixdur, intensity: { math: [intVar] } },
            ...spec.effect ?? []
        ]
    };
    dm.addSharedRes(addEoc.id, addEoc, "common_resource", "common_spell_assist");
    const flags = [...StaticData_1.CON_SPELL_FLAG];
    if (spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS");
    const { min_aoe, max_aoe, aoe_increment, min_range, max_range, range_increment, max_level, shape, valid_targets, targeted_monster_ids, targeted_monster_species } = spell;
    extraEffects.push({
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(mainid),
        effect: "effect_on_condition",
        effect_str: addEoc.id,
        name: `${spell.name}_${index}_AddEffect`,
        description: spell.name + "的添加效果子法术",
        min_aoe, max_aoe, aoe_increment,
        min_range, max_range, range_increment,
        max_level, shape, valid_targets,
        targeted_monster_ids, targeted_monster_species, flags
    });
}
;
function processRunEoc(dm, charName, baseSkillData, spec, index) {
    const { skill, TEffect, PreEffect, extraEffects } = baseSkillData;
    const { spell, one_in_chance } = skill;
    spec = spec;
    const mainid = `${spell.id}_${index}_RunEoc`;
    const runEoc = {
        type: "effect_on_condition",
        id: (0, ModDefine_1.genEOCID)(mainid),
        eoc_type: "ACTIVATION",
        effect: []
    };
    if (spec.eoc != undefined)
        runEoc.effect?.push({ run_eocs: spec.eoc });
    if (spec.effect != undefined) {
        let inline = {
            id: (0, ModDefine_1.genEOCID)(`${mainid}_inline`),
            eoc_type: "ACTIVATION",
            effect: spec.effect,
        };
        if (spec.condition != undefined)
            inline.condition = spec.condition;
        runEoc.effect?.push({ run_eocs: inline });
    }
    dm.addSharedRes(runEoc.id, runEoc, "common_resource", "common_spell_assist");
    const flags = [...StaticData_1.CON_SPELL_FLAG];
    if (spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS");
    const { min_aoe, max_aoe, aoe_increment, min_range, max_range, range_increment, max_level, shape, valid_targets, targeted_monster_ids, targeted_monster_species } = spell;
    extraEffects.push({
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(mainid),
        effect: "effect_on_condition",
        effect_str: runEoc.id,
        name: `${spell.name}_${index}_RunEoc`,
        description: spell.name + "运行Eoc子法术",
        min_aoe, max_aoe, aoe_increment,
        min_range, max_range, range_increment,
        max_level, shape, valid_targets,
        targeted_monster_ids, targeted_monster_species, flags
    });
}
;
function processExtDamage(dm, charName, baseSkillData, spec, index) {
    const { skill, TEffect, PreEffect, extraEffects } = baseSkillData;
    const { spell, one_in_chance } = skill;
    spec = spec;
    const mainid = `${spell.id}_${index}_ExtDamage`;
    const flags = [...StaticData_1.CON_SPELL_FLAG];
    if (spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS");
    const { min_aoe, max_aoe, aoe_increment, min_range, max_range, range_increment, max_level, shape, valid_targets, targeted_monster_ids, targeted_monster_species } = spell;
    extraEffects.push({
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(mainid),
        effect: "attack",
        name: `${spell.name}_${index}_ExtDamage`,
        description: spell.name + "额外伤害子法术",
        min_damage: { math: [(0, CharSkill_1.parseNumObj)(spec.amount)] },
        max_damage: StaticData_1.SPELL_MAX_DAMAGE,
        damage_type: spec.damage_type,
        min_aoe, max_aoe, aoe_increment,
        min_range, max_range, range_increment,
        max_level, shape, valid_targets,
        targeted_monster_ids, targeted_monster_species, flags
    });
}
;
