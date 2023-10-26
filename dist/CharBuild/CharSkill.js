"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharSkill = exports.getDisableSpellVar = exports.getGlobalDisableSpellVar = void 0;
const utils_1 = require("@zwa73/utils");
const ModDefine_1 = require("../ModDefine");
const CddaJsonFormat_1 = require("../CddaJsonFormat");
const StaticData_1 = require("../StaticData");
const Event_1 = require("../Event");
/**技能选择目标类型 列表 */
const TargetTypeList = [
    "auto",
    "random",
    "spell_target",
    "reverse_hit",
    "direct_hit",
    "auto_hit",
    "filter_random", //筛选目标随机 u为角色 n为受害者 处理时翻转 任意非翻转hook
];
/**特殊效果的处理表 */
const SpecProcMap = {
    AddEffect: processAddEffect,
    RunEoc: processRunEoc,
    ExtDamage: processExtDamage,
};
function processAddEffect(dm, charName, baseSkillData, spec, index) {
    const { skill, baseCond, TEffect, castCondition, PreEffect, extraEffects } = baseSkillData;
    const { spell, one_in_chance } = skill;
    spec = spec;
    const mainid = `${spell.id}_${index}_AddEffect`;
    const intVar = `${mainid}_intensity`;
    PreEffect.push({ math: [intVar, "=", parseNumObj(spec.intensity)] });
    let fixdur = spec.duration;
    if (typeof fixdur != "string" && typeof fixdur != "number") {
        const durVar = `${mainid}_duration`;
        PreEffect.push({ math: [durVar, "=", parseNumObj(fixdur)] });
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
    const { skill, baseCond, TEffect, castCondition, PreEffect, extraEffects } = baseSkillData;
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
    const { skill, baseCond, TEffect, castCondition, PreEffect, extraEffects } = baseSkillData;
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
        min_damage: { math: [parseNumObj(spec.count)] },
        damage_type: spec.damage_type,
        min_aoe, max_aoe, aoe_increment,
        min_range, max_range, range_increment,
        max_level, shape, valid_targets,
        targeted_monster_ids, targeted_monster_species, flags
    });
}
;
//全局冷却字段名
const gcdValName = `u_coCooldown`;
/**使某个技能停止使用的全局变量 */
function getGlobalDisableSpellVar(charName, spell) {
    return `${charName}_${spell.id}_disable`;
}
exports.getGlobalDisableSpellVar = getGlobalDisableSpellVar;
/**使某个技能停止使用的变量 */
function getDisableSpellVar(talker, spell) {
    return `${talker}_${spell.id}_disable`;
}
exports.getDisableSpellVar = getDisableSpellVar;
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
    return { sound_effect: varName, id: soundName, volume };
}
//法术消耗变量类型映射
const costMap = {
    "BIONIC": "u_val('power')",
    "HP": "u_hp('torso')",
    "MANA": "u_val('mana')",
    "STAMINA": "u_val('stamina')",
    "NONE": undefined,
};
/**处理角色技能 */
async function createCharSkill(dm, charName) {
    const { defineData, outData, charConfig } = await dm.getCharData(charName);
    const skills = (charConfig.skill ?? []).sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
    const skillDataList = [];
    //全局冷却事件
    const GCDEoc = (0, ModDefine_1.genActEoc)(`${charName}_CoCooldown`, [{ math: [gcdValName, "-=", "1"] }], { math: [gcdValName, ">", "0"] });
    dm.addCharEvent(charName, "CnpcUpdate", 0, GCDEoc);
    skillDataList.push(GCDEoc);
    //遍历技能
    for (const skill of skills) {
        //替换变量字段
        //skill.spell = JSON.parse(JSON.stringify(skill.spell)
        //    .replace(/(\{\{.*?\}\})/g,(match,p1)=>getFieldVarID(p1)));
        const { cast_condition, spell, extra_effect, cooldown, common_cooldown, audio, require_field, after_effect, before_effect, require_weapon_flag, require_weapon_category, require_unarmed, spec_effect } = skill;
        //法术消耗字符串
        const spellCost = `min(${spell.base_energy_cost ?? 0}+${spell.energy_increment ?? 0}*` +
            `u_val('spell_level', 'spell: ${spell.id}'),${spell.final_energy_cost ?? 999999})`;
        //法术消耗变量类型
        const costType = spell.energy_source !== undefined
            ? costMap[spell.energy_source]
            : undefined;
        //修正子法术
        const extraEffects = extra_effect ?? [];
        //生成冷却变量名
        const cdValName = `u_${spell.id}_cooldown`;
        //计算成功效果
        const TEffect = [];
        if (common_cooldown != 0)
            TEffect.push({ math: [gcdValName, "=", `${common_cooldown ?? 1}`] });
        if (spell.base_energy_cost != undefined && costType != undefined)
            TEffect.push({ math: [costType, "-=", spellCost] });
        if (cooldown)
            TEffect.push({ math: [cdValName, "=", `${cooldown ?? 0}`] });
        if (audio) {
            TEffect.push(...audio.map(audioObj => {
                if (typeof audioObj == "string")
                    return parseAudioString(charName, audioObj);
                //冷却变量ID
                const cdid = `audio_${audioObj.id}_cooldown`;
                if (audioObj.cooldown) {
                    //冷却
                    const cdeoc = (0, ModDefine_1.genActEoc)(cdid, [{ math: [cdid, "-=", "1"] }], { math: [cdid, ">", "0"] });
                    dm.addCharEvent(charName, "CnpcBattleUpdate", 0, cdeoc);
                    skillDataList.push(cdeoc);
                    //初始化
                    const initeoc = (0, ModDefine_1.genActEoc)(cdid + "_init", [{ math: [cdid, "=", "0"] }]);
                    dm.addCharEvent(charName, "CnpcEnterBattle", 0, initeoc);
                    skillDataList.push(initeoc);
                }
                const effect = {
                    run_eocs: {
                        id: (0, ModDefine_1.genEOCID)(`${charName}_${audioObj.id}_Chance`),
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
            }));
        }
        if (after_effect)
            TEffect.push(...after_effect);
        if (spell.base_casting_time) {
            const ct = parseSpellNumObj(spell, "base_casting_time");
            TEffect.push({ math: [StaticData_1.SPELL_CT_MODMOVE_VAR, "=", ct] }, { u_cast_spell: { id: StaticData_1.SPELL_CT_MODMOVE, hit_self: true } });
        }
        //计算准备效果
        const PreEffect = [];
        if (before_effect)
            PreEffect.push(...before_effect);
        //遍历释放条件
        const ccs = Array.isArray(cast_condition)
            ? cast_condition
            : [cast_condition];
        for (const castCondition of ccs) {
            const { target } = castCondition;
            //计算基础条件
            const baseCond = [
                { math: [gcdValName, "<=", "0"] },
                { math: [getDisableSpellVar("u", spell), "!=", "1"] }
            ];
            if (spell.base_energy_cost != undefined && costType != undefined)
                baseCond.push({ math: [costType, ">=", spellCost] });
            if (cooldown)
                baseCond.push({ math: [cdValName, "<=", "0"] });
            if (require_field) {
                let fdarr = typeof require_field == "string"
                    ? [require_field, 1] : require_field;
                baseCond.push({ math: [`u_${fdarr[0]}`, ">=", fdarr[1] + ""] });
            }
            //对所有武器要求进行 或 处理
            const requireWeaponCond = [];
            if (require_weapon_flag)
                requireWeaponCond.push(...require_weapon_flag.map(id => ({ u_has_wielded_with_flag: id })));
            if (require_weapon_category)
                requireWeaponCond.push(...require_weapon_category.map(id => ({ u_has_wielded_with_weapon_category: id })));
            if (require_unarmed)
                requireWeaponCond.push({ not: "u_has_weapon" });
            if (requireWeaponCond.length > 0)
                baseCond.push({ or: requireWeaponCond });
            //处理并加入输出
            const dat = {
                skill,
                TEffect,
                PreEffect,
                baseCond,
                castCondition,
                extraEffects,
            };
            let specindex = 0;
            for (const spec of spec_effect ?? [])
                SpecProcMap[spec.type](dm, charName, dat, spec, specindex++);
            skillDataList.push(...ProcMap[target ?? "auto"](dm, charName, dat));
        }
        dm.addSharedRes(spell.id, spell, "common_resource", "common_spell");
        for (const exspell of extraEffects)
            dm.addSharedRes(exspell.id, exspell, "common_resource", "common_spell");
        //冷却事件
        if (cooldown != null) {
            const CDEoc = (0, ModDefine_1.genActEoc)(`${charName}_${spell.id}_cooldown`, [{ math: [cdValName, "-=", "1"] }], { math: [cdValName, ">", "0"] });
            dm.addCharEvent(charName, "CnpcUpdate", 0, CDEoc);
            skillDataList.push(CDEoc);
        }
    }
    outData['skill'] = skillDataList;
}
exports.createCharSkill = createCharSkill;
/**处理方式表 */
const ProcMap = {
    "auto": autoProc,
    "random": randomProc,
    "spell_target": spell_targetProc,
    "reverse_hit": reverse_hitProc,
    "direct_hit": direct_hitProc,
    "auto_hit": auto_hitProc,
    "filter_random": filter_randomProc,
};
//获取施法方式的uid
function castCondUid(cc) {
    return `${cc.hook}_${cc.target ?? "auto"}`;
}
//翻转u与n
function revTalker(obj) {
    let str = JSON.stringify(obj);
    str = str.replace(/"u_(\w+?)":/g, '"tmpnpctmp_$1":');
    str = str.replace(/(?<!\w)u_/g, 'tmpntmp_');
    str = str.replace(/"npc_(\w+?)":/g, '"u_$1":');
    str = str.replace(/(?<!\w)n_/g, 'u_');
    str = str.replace(/tmpnpctmp_/g, 'npc_');
    str = str.replace(/tmpntmp_/g, 'n_');
    //修正无参条件
    const npcond = CddaJsonFormat_1.NoParamTalkerCondList.join('|');
    const regex = new RegExp(`"n_(${npcond})"`, 'g');
    str = str.replace(regex, `"npc_$1"`);
    return JSON.parse(str);
}
/**命中自身的法术变体 */
function hitselfSpell(spell) {
    const rspell = utils_1.UtilFunc.deepClone(spell);
    rspell.name = `${spell.name}_hitself`;
    rspell.id = `${rspell.id}_hitself`;
    if (!rspell.valid_targets.includes("self"))
        rspell.valid_targets.push("self");
    return rspell;
}
/**解析NumObj为math表达式 */
function parseNumObj(value) {
    let strExp = `0`;
    if (value !== undefined) {
        if (typeof value == "number")
            strExp = value + "";
        else if (typeof value == "object" && "math" in value)
            strExp = value.math[0];
        else
            throw `伤害解析只支持固定值number 或 math表达式`;
    }
    return strExp;
}
/**解析法术伤害字符串 */
function parseSpellNumObj(spell, field) {
    return parseNumObj(spell[field]);
}
/**将法术数据转为全局变量
 * 返回 预先计算全局变量的effect
 */
function fixSpellDmg(spell) {
    const dmgstr = parseSpellNumObj(spell, "min_damage");
    const dotstr = parseSpellNumObj(spell, "min_dot");
    const durstr = parseSpellNumObj(spell, "min_duration");
    const dmgvar = `${spell.id}_dmg`;
    if (spell.min_damage) {
        spell.min_damage = { math: [dmgvar] };
        spell.max_damage = StaticData_1.SPELL_MAX_DAMAGE;
    }
    const dotvar = `${spell.id}_dot`;
    if (spell.min_dot) {
        spell.min_dot = { math: [dotvar] };
        spell.max_dot = StaticData_1.SPELL_MAX_DAMAGE;
    }
    const durvar = `${spell.id}_dur`;
    if (spell.min_duration) {
        spell.min_duration = { math: [durvar] };
        spell.max_duration = StaticData_1.SPELL_MAX_DAMAGE;
    }
    return [
        { math: [dmgvar, `=`, dmgstr] },
        { math: [dotvar, `=`, dotstr] },
        { math: [durvar, `=`, durstr] },
    ];
}
function genCastEocID(charName, spell, ccuid) {
    return (0, ModDefine_1.genEOCID)(`${charName}_Cast${spell.id}_${ccuid}`);
}
function genTrueEocID(charName, spell, ccuid) {
    return (0, ModDefine_1.genEOCID)(`${charName}_${spell.id}TrueEoc_${ccuid}`);
}
function spell_targetProc(dm, charName, baseSkillData) {
    const { skill, baseCond, TEffect, castCondition, PreEffect, extraEffects } = baseSkillData;
    const { spell, one_in_chance } = skill;
    const { hook } = castCondition;
    if (castCondition.condition)
        baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);
    //加入子效果
    if (extraEffects.length > 0) {
        spell.extra_effects = spell.extra_effects ?? [];
        spell.extra_effects.push(...extraEffects.map(spell => ({ id: spell.id })));
    }
    //创建瞄准法术标靶的辅助索敌法术
    const flags = ["WONDER", "RANDOM_TARGET", ...StaticData_1.CON_SPELL_FLAG];
    if (spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS");
    const { min_aoe, max_aoe, aoe_increment, min_range, max_range, range_increment, max_level, shape } = spell;
    const selTargetSpell = {
        id: (0, ModDefine_1.genSpellID)(`${spell.id}_SelTarget`),
        type: "SPELL",
        name: spell.name + "_索敌",
        description: `${spell.name}的辅助索敌法术`,
        effect: "attack",
        min_damage: 1,
        max_damage: 1,
        valid_targets: ["hostile"],
        targeted_monster_ids: [StaticData_1.TARGET_MON_ID],
        min_aoe, max_aoe, aoe_increment,
        min_range, max_range, range_increment,
        shape, max_level, flags,
        extra_effects: [{ id: spell.id }],
    };
    dm.addSharedRes(selTargetSpell.id, selTargetSpell, "common_resource", "common_spell_assist");
    //创建施法EOC
    const castEoc = {
        type: "effect_on_condition",
        id: genCastEocID(charName, spell, ccuid),
        eoc_type: "ACTIVATION",
        effect: [
            ...PreEffect,
            {
                u_cast_spell: {
                    id: selTargetSpell.id,
                    once_in: one_in_chance,
                },
                targeted: true,
                true_eocs: {
                    id: genTrueEocID(charName, spell, ccuid),
                    effect: [...TEffect],
                    eoc_type: "ACTIVATION",
                }
            }
        ],
        condition: { and: [...baseCond] },
    };
    //加入触发
    if (Event_1.CnpcReverseEventTypeList.includes(hook)) {
        console.log(skill);
        throw `翻转事件只能应用于翻转命中`;
    }
    dm.addCharEvent(charName, hook, 0, castEoc);
    return [castEoc];
}
function randomProc(dm, charName, baseSkillData) {
    const { skill, baseCond, TEffect, castCondition, PreEffect, extraEffects } = baseSkillData;
    const { spell, one_in_chance } = skill;
    const { hook } = castCondition;
    if (castCondition.condition)
        baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);
    //加入子效果
    if (extraEffects.length > 0) {
        spell.extra_effects = spell.extra_effects ?? [];
        spell.extra_effects.push(...extraEffects.map(spell => ({ id: spell.id })));
    }
    //创建施法EOC
    const castEoc = {
        type: "effect_on_condition",
        id: genCastEocID(charName, spell, ccuid),
        eoc_type: "ACTIVATION",
        effect: [
            ...PreEffect,
            {
                u_cast_spell: {
                    id: spell.id,
                    once_in: one_in_chance,
                },
                targeted: false,
                true_eocs: {
                    id: genTrueEocID(charName, spell, ccuid),
                    effect: [...TEffect],
                    eoc_type: "ACTIVATION",
                }
            }
        ],
        condition: { and: [...baseCond] },
    };
    //加入触发
    if (Event_1.CnpcReverseEventTypeList.includes(hook)) {
        console.log(skill);
        throw `翻转事件只能应用于翻转命中`;
    }
    dm.addCharEvent(charName, hook, 0, castEoc);
    return [castEoc];
}
function reverse_hitProc(dm, charName, baseSkillData) {
    let { skill, baseCond, TEffect, castCondition, PreEffect, extraEffects } = baseSkillData;
    const { spell, one_in_chance } = skill;
    const { hook } = castCondition;
    if (castCondition.condition)
        baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);
    //复制法术
    const rspell = hitselfSpell(spell);
    //解析伤害字符串
    let dmgPreEff = fixSpellDmg(rspell);
    dm.addSharedRes(rspell.id, rspell, "common_resource", "common_spell_assist");
    //加入子效果
    if (extraEffects.length > 0) {
        spell.extra_effects = spell.extra_effects ?? [];
        spell.extra_effects.push(...extraEffects.map(spell => ({ id: spell.id })));
    }
    for (const exspell of extraEffects) {
        const rexspell = hitselfSpell(exspell);
        rspell.extra_effects = rspell.extra_effects ?? [];
        rspell.extra_effects.push({ id: rexspell.id });
        dmgPreEff.push(...fixSpellDmg(rexspell));
        dm.addSharedRes(rexspell.id, rexspell, "common_resource", "common_spell_assist");
    }
    //翻转u与n
    baseCond = revTalker(baseCond);
    TEffect = revTalker(TEffect);
    PreEffect = revTalker(PreEffect);
    dmgPreEff = revTalker(dmgPreEff);
    //创建翻转的施法EOC
    const castEoc = {
        type: "effect_on_condition",
        id: genCastEocID(charName, rspell, ccuid),
        eoc_type: "ACTIVATION",
        effect: [
            ...PreEffect,
            ...dmgPreEff,
            {
                u_cast_spell: {
                    id: rspell.id,
                    once_in: one_in_chance,
                    hit_self: true //如果是翻转事件则需命中自身
                },
                true_eocs: {
                    id: genTrueEocID(charName, rspell, ccuid),
                    effect: [...TEffect],
                    eoc_type: "ACTIVATION",
                }
            }
        ],
        condition: { and: [...baseCond] },
    };
    //加入触发
    if (Event_1.CnpcEventTypeList.includes(hook))
        throw `翻转命中 所用的事件必须为 翻转事件: ${Event_1.CnpcReverseEventTypeList}`;
    dm.addReverseCharEvent(charName, hook, 0, castEoc);
    return [castEoc];
}
function filter_randomProc(dm, charName, baseSkillData) {
    let { skill, baseCond, TEffect, castCondition, PreEffect, extraEffects } = baseSkillData;
    const { spell, one_in_chance } = skill;
    const { hook } = castCondition;
    const ccuid = castCondUid(castCondition);
    //复制法术
    const rspell = hitselfSpell(spell);
    //解析伤害字符串
    let dmgPreEff = fixSpellDmg(rspell);
    dm.addSharedRes(rspell.id, rspell, "common_resource", "common_spell_assist");
    //加入子效果
    if (extraEffects.length > 0) {
        spell.extra_effects = spell.extra_effects ?? [];
        spell.extra_effects.push(...extraEffects.map(spell => ({ id: spell.id })));
    }
    for (const exspell of extraEffects) {
        const rexspell = hitselfSpell(exspell);
        rspell.extra_effects = rspell.extra_effects ?? [];
        rspell.extra_effects.push({ id: rexspell.id });
        dmgPreEff.push(...fixSpellDmg(rexspell));
        dm.addSharedRes(rexspell.id, rexspell, "common_resource", "common_spell_assist");
    }
    //翻转u与n
    const unrbaseCond = utils_1.UtilFunc.deepClone(baseCond);
    if (castCondition.condition)
        baseCond.push(castCondition.condition);
    baseCond = revTalker(baseCond);
    TEffect = revTalker(TEffect);
    PreEffect = revTalker(PreEffect);
    dmgPreEff = revTalker(dmgPreEff);
    //命中id
    const fhitvar = `${rspell.id}_hasTarget`;
    //创建翻转的施法EOC
    const castEoc = {
        type: "effect_on_condition",
        id: genCastEocID(charName, rspell, ccuid),
        eoc_type: "ACTIVATION",
        effect: [
            ...PreEffect,
            ...dmgPreEff,
            {
                u_cast_spell: {
                    id: rspell.id,
                    once_in: one_in_chance,
                    hit_self: true //如果是翻转事件则需命中自身
                },
                true_eocs: {
                    id: genTrueEocID(charName, rspell, ccuid),
                    effect: [...TEffect, { math: [fhitvar, "=", "1"] }],
                    eoc_type: "ACTIVATION",
                }
            }
        ],
        condition: { and: [
                ...baseCond,
                { math: [fhitvar, "!=", "1"] },
            ] },
    };
    //创建筛选目标的辅助索敌法术
    const flags = [...StaticData_1.CON_SPELL_FLAG];
    if (spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS");
    const { min_range, max_range, range_increment, max_level, valid_targets, targeted_monster_ids } = spell;
    const filterTargetSpell = {
        id: (0, ModDefine_1.genSpellID)(`${charName}_${rspell.id}_FilterTarget_${ccuid}`),
        type: "SPELL",
        name: rspell.name + "_筛选索敌",
        description: `${rspell.name}的筛选索敌法术`,
        effect: "effect_on_condition",
        effect_str: castEoc.id,
        flags,
        shape: "blast",
        min_aoe: min_range,
        max_aoe: max_range,
        aoe_increment: range_increment,
        max_level, targeted_monster_ids,
        valid_targets: valid_targets.filter(item => item != "ground"),
    };
    //创建释放索敌法术的eoc
    const castSelEoc = {
        type: "effect_on_condition",
        id: (0, ModDefine_1.genEOCID)(`Cast${filterTargetSpell.id}`),
        eoc_type: "ACTIVATION",
        effect: [
            {
                u_cast_spell: {
                    id: filterTargetSpell.id,
                    once_in: one_in_chance,
                }
            },
            { math: [fhitvar, "=", "0"] }
        ],
        condition: { and: [...unrbaseCond] },
    };
    //加入触发
    if (Event_1.CnpcReverseEventTypeList.includes(hook)) {
        console.log(skill);
        throw `翻转事件只能应用于翻转命中`;
    }
    dm.addCharEvent(charName, hook, 0, castSelEoc);
    return [castEoc, castSelEoc, filterTargetSpell];
}
function direct_hitProc(dm, charName, baseSkillData) {
    const { skill, baseCond, TEffect, castCondition, PreEffect, extraEffects } = baseSkillData;
    const { spell, one_in_chance } = skill;
    const { hook } = castCondition;
    if (castCondition.condition)
        baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);
    //复制法术
    const rspell = hitselfSpell(spell);
    //解析伤害字符串
    const dmgPreEff = fixSpellDmg(rspell);
    dm.addSharedRes(rspell.id, rspell, "common_resource", "common_spell_assist");
    //加入子效果
    if (extraEffects.length > 0) {
        spell.extra_effects = spell.extra_effects ?? [];
        spell.extra_effects.push(...extraEffects.map(spell => ({ id: spell.id })));
    }
    for (const exspell of extraEffects) {
        const rexspell = hitselfSpell(exspell);
        rspell.extra_effects = rspell.extra_effects ?? [];
        rspell.extra_effects.push({ id: rexspell.id });
        dmgPreEff.push(...fixSpellDmg(rexspell));
        dm.addSharedRes(rexspell.id, rexspell, "common_resource", "common_spell_assist");
    }
    //创建翻转的施法EOC
    const castEoc = {
        type: "effect_on_condition",
        id: genCastEocID(charName, rspell, ccuid),
        eoc_type: "ACTIVATION",
        effect: [
            ...PreEffect,
            ...dmgPreEff,
            {
                npc_cast_spell: {
                    id: rspell.id,
                    once_in: one_in_chance,
                    hit_self: true //如果是翻转事件则需命中自身
                },
                true_eocs: {
                    id: genTrueEocID(charName, rspell, ccuid),
                    effect: [...TEffect],
                    eoc_type: "ACTIVATION",
                }
            }
        ],
        condition: { and: [...baseCond] },
    };
    //加入触发
    if (!Event_1.CnpcInteractiveEventList.includes(hook))
        throw `直接命中 所用的事件必须为 交互事件: ${Event_1.CnpcInteractiveEventList}`;
    dm.addCharEvent(charName, hook, 0, castEoc);
    return [castEoc];
}
function autoProc(dm, charName, baseSkillData) {
    const { skill, castCondition } = baseSkillData;
    const { spell } = skill;
    const { hook } = castCondition;
    //判断瞄准方式
    //是敌对目标法术
    const isHostileTarget = spell.valid_targets.includes("hostile");
    const isAllyTarget = spell.valid_targets.includes("ally");
    //是Aoe法术
    const isAoe = (spell.min_aoe != null && spell.min_aoe != 0) ||
        (spell.aoe_increment != null && spell.aoe_increment != 0);
    //有释放范围
    const hasRange = (spell.min_range != null && spell.min_range != 0) ||
        (spell.range_increment != null && spell.range_increment != 0);
    //aoe 有范围 敌对目标 法术将使用法术标靶
    if (isHostileTarget && isAoe && hasRange)
        return ProcMap.spell_target(dm, charName, baseSkillData);
    //有范围 有条件 友方目标 法术适用筛选命中
    if (isAllyTarget && hasRange && castCondition.condition != undefined)
        return ProcMap.filter_random(dm, charName, baseSkillData);
    //非aoe hook为互动事件 敌对目标 法术将直接命中
    if ((Event_1.CnpcReverseEventTypeList.includes(hook) ||
        Event_1.CnpcInteractiveEventList.includes(hook)) &&
        isHostileTarget && !isAoe)
        return ProcMap.auto_hit(dm, charName, baseSkillData);
    //其他法术随机
    return ProcMap.random(dm, charName, baseSkillData);
}
function auto_hitProc(dm, charName, baseSkillData) {
    const { skill, castCondition } = baseSkillData;
    const { hook } = castCondition;
    if (Event_1.CnpcReverseEventTypeList.includes(hook))
        return ProcMap.reverse_hit(dm, charName, baseSkillData);
    if (Event_1.CnpcInteractiveEventList.includes(hook))
        return ProcMap.direct_hit(dm, charName, baseSkillData);
    throw `auto_hitProc 的hook 必须为 翻转事件:${Event_1.CnpcReverseEventTypeList}\n或互动事件:&{InteractiveCharEventList}`;
}
