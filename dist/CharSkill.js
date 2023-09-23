"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharSkill = void 0;
const _1 = require(".");
const BaseMonster_1 = require("./StaticData/BaseMonster");
async function createCharSkill(dm, charName) {
    const { baseData, outData, charConfig } = await dm.getCharData(charName);
    const skills = (charConfig.skill || []).sort((a, b) => (b.weight || 0) - (a.weight || 0));
    const skillDataList = [];
    //遍历技能
    for (const skill of skills) {
        const { condition, hook, spell, chance, cooldown, audio } = skill;
        //生成冷却变量名
        const cdValName = `u_${spell.id}_Cooldown`;
        //计算基础条件
        const baseCond = [];
        if (condition)
            baseCond.push(condition);
        if (cooldown)
            baseCond.push({ math: [cdValName, "<=", "0"] });
        //计算成功效果
        const TEffect = [];
        if (cooldown)
            TEffect.push({ math: [cdValName, "=", `${cooldown || 0}`] });
        if (audio)
            TEffect.push(...audio.map(audioName => ({ sound_effect: audioName, id: charName, volume: 100 })));
        //如果需要选择目标 创建索敌辅助法术
        let selTargetSpell = null;
        if (spell.valid_targets.includes("hostile") ||
            spell.valid_targets.includes("ground") ||
            spell.valid_targets.includes("ally")) {
            const { min_aoe, max_aoe, aoe_increment, min_range, max_range, range_increment, max_level, shape } = spell;
            selTargetSpell = {
                id: (spell.id + "_SelTarget"),
                type: "SPELL",
                name: spell.name + "_索敌",
                description: `${spell.name}的辅助索敌法术`,
                effect: "attack",
                flags: ["WONDER", "RANDOM_TARGET", "NO_EXPLOSION_SFX", ..._1.ControlSpellFlags],
                min_damage: 1,
                max_damage: 1,
                valid_targets: ["hostile"],
                targeted_monster_ids: [BaseMonster_1.TARGET_MON_ID],
                min_aoe, max_aoe, aoe_increment,
                min_range, max_range, range_increment,
                shape, max_level,
                extra_effects: [{ id: spell.id }],
            };
        }
        //法术消耗字符串
        const costMathStr = `min(${spell.base_energy_cost || 0}+${spell.energy_increment || 0}*` +
            `u_val('spell_level', 'spell: ${spell.id}'),${spell.final_energy_cost || 999999})`;
        //创建施法EOC
        const castEoc = {
            type: "effect_on_condition",
            id: (0, _1.genEOCID)(`Cast${spell.id}`),
            eoc_type: "ACTIVATION",
            effect: [
                {
                    u_cast_spell: {
                        id: selTargetSpell?.id || spell.id,
                        once_in: chance,
                    },
                    targeted: selTargetSpell ? true : false,
                    true_eocs: {
                        id: (0, _1.genEOCID)(`${spell.id}TrueEoc`),
                        effect: [
                            { math: ["u_val('mana')", "-=", costMathStr] },
                            ...TEffect
                        ],
                        eoc_type: "ACTIVATION",
                    }
                }
            ],
            condition: baseCond.length > 0
                ? { and: [{ math: ["u_val('mana')", ">=", costMathStr] }, ...baseCond] }
                : { math: ["u_val('mana')", ">=", costMathStr] },
        };
        //加入触发
        dm.addCharEvent(charName, hook, castEoc);
        skillDataList.push(castEoc, spell);
        if (selTargetSpell != null)
            skillDataList.push(selTargetSpell);
        //冷却事件
        if (cooldown != null) {
            const CDEoc = {
                type: "effect_on_condition",
                id: (0, _1.genEOCID)(`${spell.id}_Cooldown`),
                effect: [
                    { math: [cdValName, "-=", "1"] }
                ],
                condition: { math: [cdValName, ">=", "0"] },
                eoc_type: "ACTIVATION",
            };
            dm.addCharEvent(charName, "CharUpdate", CDEoc);
            skillDataList.push(CDEoc);
        }
    }
    outData['skill'] = skillDataList;
}
exports.createCharSkill = createCharSkill;
