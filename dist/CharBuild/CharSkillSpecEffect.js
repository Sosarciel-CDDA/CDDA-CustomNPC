"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecProcMap = void 0;
const CharSkill_1 = require("./CharSkill");
const CMDefine_1 = require("../CMDefine");
const StaticData_1 = require("../StaticData");
/**特殊效果的处理表 */
exports.SpecProcMap = {
    AddEffect: processAddEffect,
    RunEoc: processRunEoc,
    ExtDamage: processExtDamage,
    Audio: processAudio,
};
const genMainID = (skill, spec, index) => `${skill.spell.id}_${spec.type}_${index}`;
function processAddEffect(dm, charName, baseSkillData, spec, index) {
    const { skill, extra_effects } = baseSkillData;
    const { spell } = skill;
    spec = spec;
    const mainid = genMainID(skill, spec, index);
    const addEoc = {
        type: "effect_on_condition",
        id: CMDefine_1.CMDef.genEOCID(mainid),
        eoc_type: "ACTIVATION",
        effect: [
            spec.is_stack == true
                ? { u_add_effect: spec.effect_id, duration: spec.duration, intensity: { math: [`max(u_effect_intensity('${spec.effect_id}'),0) + ${(0, CharSkill_1.parseNumObj)(spec.intensity)}`] } }
                : { u_add_effect: spec.effect_id, duration: spec.duration, intensity: { math: [(0, CharSkill_1.parseNumObj)(spec.intensity)] } },
            ...spec.effect ?? []
        ]
    };
    dm.addSharedRes(addEoc.id, addEoc, "common_resource", "common_spell_assist");
    const flags = [...StaticData_1.CON_SPELL_FLAG];
    if (spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS");
    const { min_aoe, max_aoe, aoe_increment, min_range, max_range, range_increment, max_level, shape, valid_targets, targeted_monster_ids, targeted_monster_species } = spell;
    extra_effects.push({
        type: "SPELL",
        id: CMDefine_1.CMDef.genSpellID(mainid),
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
    const { skill, extra_effects } = baseSkillData;
    const { spell } = skill;
    spec = spec;
    const mainid = genMainID(skill, spec, index);
    const runEoc = {
        type: "effect_on_condition",
        id: CMDefine_1.CMDef.genEOCID(mainid),
        eoc_type: "ACTIVATION",
        effect: []
    };
    if (spec.eoc != undefined)
        runEoc.effect?.push({ run_eocs: spec.eoc });
    if (spec.effect != undefined) {
        let inline = {
            id: CMDefine_1.CMDef.genEOCID(`${mainid}_inline`),
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
    extra_effects.push({
        type: "SPELL",
        id: CMDefine_1.CMDef.genSpellID(mainid),
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
    const { skill, extra_effects } = baseSkillData;
    const { spell } = skill;
    spec = spec;
    const mainid = genMainID(skill, spec, index);
    const flags = [...StaticData_1.CON_SPELL_FLAG];
    if (spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS");
    const { min_aoe, max_aoe, aoe_increment, min_range, max_range, range_increment, max_level, shape, valid_targets, targeted_monster_ids, targeted_monster_species } = spell;
    extra_effects.push({
        type: "SPELL",
        id: CMDefine_1.CMDef.genSpellID(mainid),
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
function processAudio(dm, charName, baseSkillData, spec, index) {
    const { skill, extra_effects } = baseSkillData;
    const { spell } = skill;
    spec = spec;
    const mainid = genMainID(skill, spec, index);
    const { audio } = spec;
    /**解析音频id */
    function parseAudioString(charName, str, volume = 100) {
        let soundName = charName;
        let varName = str;
        if (str.includes(":")) {
            const match = str.match(/(.+):(.+)/);
            if (match == null)
                throw `parseAudioString 解析错误 字符串:${str}`;
            soundName = match[1];
            varName = match[2];
        }
        return {
            sound_effect: varName,
            id: soundName,
            volume
        };
    }
    function procAudio(audio) {
        return audio.map((audioObj) => {
            if (typeof audioObj == "string")
                return parseAudioString(charName, audioObj);
            //冷却变量ID
            const cdid = `u_audio_${audioObj.id}_cooldown`;
            if (audioObj.cooldown) {
                //冷却
                const cdeoc = CMDefine_1.CMDef.genActEoc(cdid, [{ math: [cdid, "-=", "1"] }], { math: [cdid, ">", "0"] });
                dm.addInvokeEoc("BattleUpdate", 0, cdeoc);
                dm.addSharedRes(cdeoc.id, cdeoc, "common_resource", "common_spell_assist");
                //初始化
                const initeoc = CMDefine_1.CMDef.genActEoc(cdid + "_init", [{ math: [cdid, "=", "0"] }]);
                dm.addInvokeEoc("EnterBattle", 0, initeoc);
                dm.addSharedRes(initeoc.id, initeoc, "common_resource", "common_spell_assist");
            }
            const effect = {
                run_eocs: {
                    id: CMDefine_1.CMDef.genEOCID(`${charName}_${audioObj.id}_Chance`),
                    eoc_type: "ACTIVATION",
                    condition: { and: [
                            { one_in_chance: audioObj.one_in_chance ?? 1 },
                            { math: [cdid, "<=", "0"] }
                        ] },
                    effect: [
                        parseAudioString(charName, audioObj.id, audioObj.volume),
                        { math: [cdid, "=", (audioObj.cooldown ?? 0) + ""] }
                    ],
                }
            };
            return effect;
        });
    }
    const addEoc = {
        type: "effect_on_condition",
        id: CMDefine_1.CMDef.genEOCID(mainid),
        eoc_type: "ACTIVATION",
        effect: [...procAudio(audio)]
    };
    dm.addSharedRes(addEoc.id, addEoc, "common_resource", "common_spell_assist");
    extra_effects.push({
        type: "SPELL",
        id: CMDefine_1.CMDef.genSpellID(mainid),
        effect: "effect_on_condition",
        name: `${spell.name}_${index}_Audio`,
        description: spell.name + "音效法术",
        effect_str: addEoc.id,
        valid_targets: ["self"],
        shape: "blast"
    });
}
;
