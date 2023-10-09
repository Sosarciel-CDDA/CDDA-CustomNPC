"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharSkill = exports.stopSpellVar = void 0;
const utils_1 = require("@zwa73/utils");
const _1 = require(".");
const BaseMonster_1 = require("./StaticData/BaseMonster");
const Event_1 = require("./Event");
const CharConfig_1 = require("./CharConfig");
//脚本提供的判断是否成功命中目标的全局变量 字段
const hasTargetVar = "hasTarget";
//全局冷却字段名
const gcdValName = `u_coCooldown`;
/**使某个技能停止使用的变量 */
function stopSpellVar(charName, spell) {
    return `${charName}_${spell.id}_stop`;
}
exports.stopSpellVar = stopSpellVar;
//法术消耗变量类型映射
const costMap = {
    "BIONIC": "u_val('power')",
    "HP": "u_hp()",
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
    const GCDEoc = {
        type: "effect_on_condition",
        id: (0, _1.genEOCID)(`${charName}_CoCooldown`),
        effect: [
            { math: [gcdValName, "-=", "1"] }
        ],
        condition: { math: [gcdValName, ">", "0"] },
        eoc_type: "ACTIVATION",
    };
    dm.addCharEvent(charName, "CharUpdate", 0, GCDEoc);
    skillDataList.push(GCDEoc);
    //遍历技能
    for (const skill of skills) {
        //替换变量字段
        skill.spell = JSON.parse(JSON.stringify(skill.spell)
            .replace(/(\{\{.*?\}\})/g, (match, p1) => (0, CharConfig_1.getFieldVarID)(charName, p1)));
        const { cast_condition, spell, cooldown, common_cooldown, audio, require_field, effect } = skill;
        //法术消耗字符串
        const spellCost = `min(${spell.base_energy_cost ?? 0}+${spell.energy_increment ?? 0}*` +
            `u_val('spell_level', 'spell: ${spell.id}'),${spell.final_energy_cost ?? 999999})`;
        //法术消耗变量类型
        const costType = spell.energy_source !== undefined
            ? costMap[spell.energy_source]
            : undefined;
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
                    return ({ sound_effect: audioObj, id: charName, volume: 100 });
                const effect = {
                    run_eocs: {
                        id: (0, _1.genEOCID)(`${charName}_${audioObj.id}_Chance`),
                        eoc_type: "ACTIVATION",
                        condition: { one_in_chance: audioObj.one_in_chance ?? 1 },
                        effect: [
                            { sound_effect: audioObj.id, id: charName, volume: audioObj.volume ?? 100 }
                        ],
                    }
                };
                return effect;
            }));
        }
        if (effect)
            TEffect.push(...effect);
        //遍历释放条件
        const ccs = Array.isArray(cast_condition)
            ? cast_condition
            : [cast_condition];
        for (const castCondition of ccs) {
            const { condition, target } = castCondition;
            //计算基础条件
            const baseCond = [
                { math: [gcdValName, "<=", "0"] },
                { math: [stopSpellVar(charName, spell), "!=", "1"] }
            ];
            if (spell.base_energy_cost != undefined && costType != undefined)
                baseCond.push({ math: [costType, ">=", spellCost] });
            if (condition)
                baseCond.push(condition);
            if (cooldown)
                baseCond.push({ math: [cdValName, "<=", "0"] });
            if (require_field) {
                let fdarr = typeof require_field == "string"
                    ? [require_field, 1] : require_field;
                baseCond.push({ math: [fdarr[0], ">=", fdarr[1] + ""] });
            }
            //基本通用数据
            const baseSkillData = {
                skill,
                TEffect,
                baseCond,
                spellCost,
                castCondition,
            };
            //处理并加入输出
            skillDataList.push(...ProcMap[target ?? "auto"](dm, charName, baseSkillData));
        }
        skillDataList.push(spell);
        //冷却事件
        if (cooldown != null) {
            const CDEoc = {
                type: "effect_on_condition",
                id: (0, _1.genEOCID)(`${charName}_${spell.id}_cooldown`),
                effect: [
                    { math: [cdValName, "-=", "1"] }
                ],
                condition: { math: [cdValName, ">", "0"] },
                eoc_type: "ACTIVATION",
            };
            dm.addCharEvent(charName, "CharUpdate", 0, CDEoc);
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
};
//获取施法方式的uid
function castCondUid(cc) {
    return `${cc.hook}_${cc.target ?? "auto"}`;
}
function spell_targetProc(dm, charName, baseSkillData) {
    const { skill, baseCond, TEffect, castCondition } = baseSkillData;
    const { spell, one_in_chance } = skill;
    const { hook } = castCondition;
    const ccuid = castCondUid(castCondition);
    //如果需要选择目标 创建索敌辅助法术
    const { min_aoe, max_aoe, aoe_increment, min_range, max_range, range_increment, max_level, shape } = spell;
    const selTargetSpell = {
        id: `${spell.id}_SelTarget_${ccuid}`,
        type: "SPELL",
        name: spell.name + "_索敌",
        description: `${spell.name}的辅助索敌法术`,
        effect: "attack",
        flags: ["WONDER", "RANDOM_TARGET", ..._1.CON_SPELL_FLAG],
        min_damage: 1,
        max_damage: 1,
        valid_targets: ["hostile"],
        targeted_monster_ids: [BaseMonster_1.TARGET_MON_ID],
        min_aoe, max_aoe, aoe_increment,
        min_range, max_range, range_increment,
        shape, max_level,
        extra_effects: [{ id: spell.id }],
    };
    //创建施法EOC
    const castEoc = {
        type: "effect_on_condition",
        id: (0, _1.genEOCID)(`${charName}_Cast${spell.id}_${ccuid}`),
        eoc_type: "ACTIVATION",
        effect: [
            {
                u_cast_spell: {
                    id: selTargetSpell.id,
                    once_in: one_in_chance,
                },
                targeted: true,
                true_eocs: {
                    id: (0, _1.genEOCID)(`${charName}_${spell.id}TrueEoc_${ccuid}`),
                    effect: [...TEffect],
                    eoc_type: "ACTIVATION",
                }
            }
        ],
        condition: { and: [
                { math: [hasTargetVar, "==", "1"] },
                ...baseCond
            ] },
    };
    //加入触发
    if (Event_1.ReverseCharEventTypeList.includes(hook))
        throw `翻转事件只能应用于翻转命中`;
    dm.addCharEvent(charName, hook, 0, castEoc);
    return [castEoc, selTargetSpell];
}
function randomProc(dm, charName, baseSkillData) {
    const { skill, baseCond, TEffect, castCondition } = baseSkillData;
    const { spell, one_in_chance } = skill;
    const { hook } = castCondition;
    const ccuid = castCondUid(castCondition);
    //创建施法EOC
    const castEoc = {
        type: "effect_on_condition",
        id: (0, _1.genEOCID)(`${charName}_Cast${spell.id}_${ccuid}`),
        eoc_type: "ACTIVATION",
        effect: [
            {
                u_cast_spell: {
                    id: spell.id,
                    once_in: one_in_chance,
                },
                targeted: false,
                true_eocs: {
                    id: (0, _1.genEOCID)(`${charName}_${spell.id}TrueEoc_${ccuid}`),
                    effect: [...TEffect],
                    eoc_type: "ACTIVATION",
                }
            }
        ],
        condition: { and: [...baseCond] },
    };
    //加入触发
    if (Event_1.ReverseCharEventTypeList.includes(hook))
        throw `翻转事件只能应用于翻转命中`;
    dm.addCharEvent(charName, hook, 0, castEoc);
    return [castEoc];
}
//翻转u与n
function revTalker(obj) {
    let str = JSON.stringify(obj);
    str = str.replace(/"u_(\w+?)":/g, '"npc_$1":');
    str = str.replace(/(?<!\w)u_/g, 'n_');
    return JSON.parse(str);
}
function reverse_hitProc(dm, charName, baseSkillData) {
    let { skill, baseCond, TEffect, castCondition } = baseSkillData;
    const { spell, one_in_chance } = skill;
    const { hook } = castCondition;
    const ccuid = castCondUid(castCondition);
    //复制法术
    const rspell = utils_1.UtilFunc.deepClone(spell);
    rspell.id = `${rspell.id}_reverse_${ccuid}`;
    rspell.valid_targets.push("self");
    //解析伤害字符串
    let dmgstr = `0`;
    let dmgvar = `${rspell.id}_reverse_dmg_${ccuid}`;
    if (rspell.min_damage !== undefined) {
        if (typeof rspell.min_damage == "number")
            dmgstr = rspell.min_damage + "";
        else if ("math" in rspell.min_damage)
            dmgstr = rspell.min_damage.math[0];
        else
            throw `翻转命中伤害只支持固定值number 或 math表达式`;
    }
    rspell.min_damage = { math: [dmgvar] };
    rspell.max_damage = 999999;
    //翻转u与n
    baseCond = JSON.parse(JSON.stringify(baseCond).replace(/(?<!\w)u_/g, 'n_'));
    TEffect = JSON.parse(JSON.stringify(TEffect).replace(/(?<!\w)u_/g, 'n_'));
    dmgstr = dmgstr.replace(/(?<!\w)u_/g, 'n_');
    //创建翻转的施法EOC
    const castEoc = {
        type: "effect_on_condition",
        id: (0, _1.genEOCID)(`${charName}_Cast${spell.id}_${ccuid}`),
        eoc_type: "ACTIVATION",
        effect: [
            { math: [dmgvar, `=`, dmgstr] },
            {
                u_cast_spell: {
                    id: rspell.id,
                    once_in: one_in_chance,
                    hit_self: true //如果是翻转事件则需命中自身
                },
                true_eocs: {
                    id: (0, _1.genEOCID)(`${charName}_${spell.id}TrueEoc_${ccuid}`),
                    effect: [...TEffect],
                    eoc_type: "ACTIVATION",
                }
            }
        ],
        condition: { and: [...baseCond] },
    };
    //加入触发
    if (Event_1.CharEventTypeList.includes(hook))
        throw `翻转命中 所用的事件必须为 翻转事件: ${Event_1.ReverseCharEventTypeList}`;
    dm.addReverseCharEvent(charName, hook, 0, castEoc);
    return [rspell, castEoc];
}
function direct_hitProc(dm, charName, baseSkillData) {
    let { skill, baseCond, TEffect, castCondition } = baseSkillData;
    const { spell, one_in_chance } = skill;
    const { hook } = castCondition;
    const ccuid = castCondUid(castCondition);
    //复制法术
    const rspell = utils_1.UtilFunc.deepClone(spell);
    rspell.id = `${rspell.id}_reverse_${ccuid}`;
    rspell.valid_targets.push("self");
    //解析伤害字符串
    let dmgstr = `0`;
    let dmgvar = `${rspell.id}_reverse_dmg_${ccuid}`;
    if (rspell.min_damage !== undefined) {
        if (typeof rspell.min_damage == "number")
            dmgstr = rspell.min_damage + "";
        else if ("math" in rspell.min_damage)
            dmgstr = rspell.min_damage.math[0];
        else
            throw `直接命中伤害只支持固定值number 或 math表达式`;
    }
    rspell.min_damage = { math: [dmgvar] };
    rspell.max_damage = 999999;
    //创建翻转的施法EOC
    const castEoc = {
        type: "effect_on_condition",
        id: (0, _1.genEOCID)(`${charName}_Cast${spell.id}_${ccuid}`),
        eoc_type: "ACTIVATION",
        effect: [
            { math: [dmgvar, `=`, dmgstr] },
            {
                npc_cast_spell: {
                    id: rspell.id,
                    once_in: one_in_chance,
                    hit_self: true //如果是翻转事件则需命中自身
                },
                true_eocs: {
                    id: (0, _1.genEOCID)(`${charName}_${spell.id}TrueEoc_${ccuid}`),
                    effect: [...TEffect],
                    eoc_type: "ACTIVATION",
                }
            }
        ],
        condition: { and: ["npc_is_alive",
                { math: [hasTargetVar, "==", "1"] },
                ...baseCond] },
    };
    //加入触发
    if (!Event_1.InteractiveCharEventList.includes(hook))
        throw `直接命中 所用的事件必须为 交互事件: ${Event_1.InteractiveCharEventList}`;
    dm.addCharEvent(charName, hook, 0, castEoc);
    return [rspell, castEoc];
}
function autoProc(dm, charName, baseSkillData) {
    const { skill, castCondition } = baseSkillData;
    const { spell } = skill;
    const { hook } = castCondition;
    //判断瞄准方式
    //是敌对目标法术
    const isHostileTarget = spell.valid_targets.includes("hostile");
    //是Aoe法术
    const isAoe = (spell.min_aoe != null && spell.min_aoe != 0) ||
        (spell.aoe_increment != null && spell.aoe_increment != 0);
    //aoe敌对目标法术将使用法术标靶
    if (isHostileTarget && isAoe)
        return ProcMap.spell_target(dm, charName, baseSkillData);
    //非aoe 且 hook为互动事件的的敌对目标法术 将直接命中
    if ((Event_1.ReverseCharEventTypeList.includes(hook) ||
        Event_1.InteractiveCharEventList.includes(hook)) &&
        isHostileTarget)
        return ProcMap.auto_hit(dm, charName, baseSkillData);
    //其他法术随机
    return ProcMap.random(dm, charName, baseSkillData);
}
function auto_hitProc(dm, charName, baseSkillData) {
    const { skill, castCondition } = baseSkillData;
    const { hook } = castCondition;
    if (Event_1.ReverseCharEventTypeList.includes(hook))
        return ProcMap.reverse_hit(dm, charName, baseSkillData);
    if (Event_1.InteractiveCharEventList.includes(hook))
        return ProcMap.direct_hit(dm, charName, baseSkillData);
    throw `auto_hitProc 的hook 必须为 翻转事件:${Event_1.ReverseCharEventTypeList}\n或互动事件:&{InteractiveCharEventList}`;
}
