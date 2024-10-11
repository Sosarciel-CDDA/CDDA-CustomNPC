"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharSkill = createCharSkill;
exports.parseNumObj = parseNumObj;
const utils_1 = require("@zwa73/utils");
const CharSkillSpecEffect_1 = require("./CharSkillSpecEffect");
const CharData_1 = require("./CharData");
const UtilGener_1 = require("./UtilGener");
const CMDefine_1 = require("../CMDefine");
/**处理角色技能 */
async function createCharSkill(dm, charName) {
    const charConfig = await (0, CharData_1.getCharConfig)(charName);
    const spells = [];
    const skills = (charConfig.skill ?? []);
    const skillDataList = [];
    const castAIJson = {
        require_mod: "cnpc",
        common_condition: { u_has_trait: (0, UtilGener_1.getCharMutId)(charName) },
        table: {}
    };
    //遍历技能
    for (const skill of skills) {
        const { spell, extra_effects, spec_effect, cast_ai } = skill;
        //共同条件
        castAIJson.table[spell.id] = cast_ai;
        const procCommCond = procCommonCond(skill);
        if (procCommCond.length > 0)
            cast_ai.common_condition = cast_ai.common_condition
                ? { and: [cast_ai.common_condition, ...procCommCond] }
                : { and: [...procCommCond] };
        //修正子法术
        const fixExtraEffects = extra_effects ?? [];
        //生成子效果 并加入子法术 extraEffects
        const specDat = {
            skill, extra_effects: fixExtraEffects,
        };
        let specindex = 0;
        for (const spec of spec_effect ?? [])
            CharSkillSpecEffect_1.SpecProcMap[spec.type](dm, charName, specDat, spec, specindex++);
        //加入子效果
        if (fixExtraEffects.length > 0) {
            spell.extra_effects = spell.extra_effects ?? [];
            spell.extra_effects.push(...fixExtraEffects.map(spell => ({
                id: spell.id,
                hit_self: spell.valid_targets.length == 1 && spell.valid_targets[0] == 'self' ? true : undefined
            })));
        }
        //生成法术
        dm.addSharedRes(spell.id, spell, "common_resource", "common_spell");
        spells.push(spell);
        for (const exspell of fixExtraEffects)
            dm.addSharedRes(exspell.id, exspell, "common_resource", "common_spell");
    }
    dm.addCharData(charName, skillDataList, 'skill');
    await utils_1.UtilFT.writeJSONFile((0, CMDefine_1.getCharCastAIPath)(charName), castAIJson);
    await utils_1.UtilFT.writeJSONFile((0, CMDefine_1.getCharCastSpellPath)(charName), spells);
}
function procCommonCond(skill) {
    const { require_weapon_flag, require_weapon_category, require_unarmed, require_field } = skill;
    const commonCondList = [];
    //对所有武器要求进行 或 处理
    const requireWeaponCond = [];
    if (require_weapon_flag)
        requireWeaponCond.push(...require_weapon_flag.map(id => ({ u_has_wielded_with_flag: id })));
    if (require_weapon_category)
        requireWeaponCond.push(...require_weapon_category.map(id => ({ u_has_wielded_with_weapon_category: id })));
    if (require_unarmed)
        requireWeaponCond.push({ not: "u_has_weapon" });
    if (requireWeaponCond.length > 0)
        commonCondList.push({ or: requireWeaponCond });
    if (require_field) {
        let fdarr = typeof require_field == "string"
            ? [require_field, 1] : require_field;
        commonCondList.push({ math: [`u_${fdarr[0]}`, ">=", fdarr[1] + ""] });
    }
    return commonCondList;
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
