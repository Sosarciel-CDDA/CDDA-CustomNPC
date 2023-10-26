"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTriggerEffect = void 0;
const ModDefine_1 = require("../ModDefine");
const UtilGener_1 = require("./UtilGener");
const StaticData_1 = require("../StaticData");
/**回复收到的伤害 */
//const regenDmg = {npc_set_hp:{arithmetic:[{npc_val:"hp",bodypart:{context_val:"bp"}} as any,"+",{context_val:"damage_taken"}]}};
const regenDmg = { math: ["n_hp(_bp)", "+=", "_damage_taken"] };
async function createTriggerEffect(dm) {
    await FrostShield(dm);
    await Electrify(dm);
    await Discharge(dm);
    await Trauma(dm);
    await Laceration(dm);
    await EmergencyFreeze(dm);
}
exports.createTriggerEffect = createTriggerEffect;
const TEFF_DUR = '60 s';
const TEFF_MAX = 100000;
//霜盾
function FrostShield(dm) {
    const taoe = 3;
    const effid = "FrostShield";
    const tex = {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(`${effid}_Trigger1`),
        name: "霜盾触发推动",
        description: "霜盾触发推动",
        effect: "area_push",
        min_aoe: taoe,
        max_aoe: taoe,
        valid_targets: ["hostile"],
        shape: "blast",
        flags: ["SILENT", "NO_EXPLOSION_SFX"]
    };
    const tspell = {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(`${effid}_Trigger2`),
        name: "霜盾触发冻结",
        description: "霜盾触发冻结",
        effect: "mod_moves",
        min_damage: -200,
        max_damage: -200,
        min_aoe: taoe,
        max_aoe: taoe,
        valid_targets: ["hostile"],
        shape: "blast",
        extra_effects: [{ id: tex.id }, { id: tex.id }, { id: tex.id }]
    };
    const eff = {
        type: "effect_type",
        id: effid,
        name: ["霜盾"],
        desc: ["受到攻击时会无视伤害, 并击退且冻结周围敌人。"],
        max_intensity: TEFF_MAX,
        max_duration: TEFF_DUR,
        enchantments: [{
                condition: "ALWAYS",
                values: [{
                        value: "FORCEFIELD",
                        add: 1
                    }]
            }]
    };
    const teoc = (0, UtilGener_1.genTriggerEffect)(dm, eff, "TakeDamage", "-1", [
        { u_cast_spell: { id: tex.id } },
        { u_cast_spell: { id: tspell.id } },
        { sound_effect: "IceHit", id: "BaseAudio", volume: 100 }
    ], TEFF_DUR, undefined, "1 s");
    dm.addStaticData([tex, tspell, eff, teoc], "common_resource", "trigger_effect", "FrostShield");
}
//感电
function Electrify(dm) {
    const effid = "Electrify";
    const extid = "Serial";
    const dur = "60 s";
    const eff = {
        type: "effect_type",
        id: effid,
        name: ["感电"],
        desc: [`可被 放电 伤害激发, 造成相当于 放电伤害*感电层数 的电击伤害。`],
        max_intensity: TEFF_MAX,
        max_duration: dur
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${effid}_OnDamage`),
        effect: [
            regenDmg,
            { npc_add_effect: effid, duration: dur, intensity: { math: [`n_effect_intensity('${effid}') + (_total_damage * n_effect_intensity('${extid}')>0? 2 : 1)`] } },
        ]
    };
    const dt = {
        id: effid,
        type: "damage_type",
        name: "感电",
        physical: false,
        magic_color: "yellow",
        derived_from: ["electric", 1],
        ondamage_eocs: [onDmgEoc.id]
    };
    //串流
    const exteff = {
        type: "effect_type",
        id: extid,
        name: ["串流"],
        desc: ["感电 叠加的层数翻倍。"],
        max_intensity: 1,
        max_duration: dur
    };
    dm.addStaticData([eff, onDmgEoc, dt, exteff, (0, UtilGener_1.genDIO)(dt)], "common_resource", "trigger_effect", "Electrify");
}
//放电
function Discharge(dm) {
    const effid = "Discharge";
    const dmgeffid = "Electrify";
    const tspell = {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(`${effid}_Trigger`),
        name: "放电感电触发伤害",
        description: "放电感电触发伤害",
        effect: "attack",
        min_damage: { math: [`u_effect_intensity('${dmgeffid}') * tmpDischargeDmg`] },
        max_damage: StaticData_1.SPELL_MAX_DAMAGE,
        valid_targets: ["self"],
        shape: "blast",
        damage_type: "electric",
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${effid}_OnDamage`),
        effect: [
            regenDmg,
            { math: ["tmpDischargeDmg", "=", "_total_damage/10"] },
            { npc_cast_spell: { id: tspell.id, hit_self: true } },
            { npc_lose_effect: dmgeffid },
        ]
    };
    const dt = {
        id: effid,
        type: "damage_type",
        name: "放电",
        physical: false,
        magic_color: "yellow",
        ondamage_eocs: [onDmgEoc.id]
    };
    dm.addStaticData([onDmgEoc, dt, tspell, (0, UtilGener_1.genDIO)(dt)], "common_resource", "trigger_effect", "Discharge");
}
//创伤
function Trauma(dm) {
    const effid = "Trauma";
    const stackcount = TEFF_MAX;
    const dur = "10 s";
    const tspell = {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(`${effid}_Trigger`),
        name: "创伤触发伤害",
        description: "创伤触发伤害",
        effect: "attack",
        min_damage: { math: [`u_effect_intensity('${effid}')`] },
        max_damage: StaticData_1.SPELL_MAX_DAMAGE,
        valid_targets: ["self"],
        shape: "blast",
        damage_type: "cut",
    };
    const eff = {
        type: "effect_type",
        id: effid,
        name: ["创伤"],
        desc: [`每秒受到一次相当于 创伤层数 的伤害。`],
        apply_message: "一道伤口正在蚕食着你的躯体",
        base_mods: {
            hurt_min: [1],
            hurt_tick: [100]
        },
        scaling_mods: {
            hurt_min: [1]
        },
        max_intensity: stackcount,
        max_duration: dur,
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${effid}_OnDamage`),
        effect: [
            regenDmg,
            { npc_add_effect: effid, duration: dur, intensity: { math: [`n_effect_intensity('${effid}') + _total_damage`] } }
        ]
    };
    const dt = {
        id: effid,
        type: "damage_type",
        name: "创伤",
        physical: false,
        magic_color: "white",
        derived_from: ["cut", 1],
        ondamage_eocs: [onDmgEoc.id]
    };
    dm.addStaticData([tspell, eff, onDmgEoc, dt, (0, UtilGener_1.genDIO)(dt)], "common_resource", "trigger_effect", "Trauma");
}
//撕裂
function Laceration(dm) {
    const effid = "Laceration";
    const tspell = {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(`${effid}_Trigger`),
        name: "撕裂创伤触发伤害",
        description: "撕裂创伤触发伤害",
        effect: "attack",
        min_damage: { math: [`u_effect_intensity('${effid}') * tmpLacerationDmg`] },
        max_damage: StaticData_1.SPELL_MAX_DAMAGE,
        valid_targets: ["self"],
        shape: "blast",
        damage_type: "cut",
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${effid}_OnDamage`),
        effect: [
            regenDmg,
            { math: ["tmpLacerationDmg", "=", "_total_damage/10"] },
            { npc_cast_spell: { id: tspell.id, hit_self: true } },
        ]
    };
    const dt = {
        id: effid,
        type: "damage_type",
        name: "撕裂",
        physical: false,
        magic_color: "white",
        ondamage_eocs: [onDmgEoc.id]
    };
    dm.addStaticData([onDmgEoc, dt, tspell, (0, UtilGener_1.genDIO)(dt)], "common_resource", "trigger_effect", "Laceration");
}
//紧急冻结
function EmergencyFreeze(dm) {
    const taoe = 5;
    const effid = "EmergencyFreeze";
    const tex = {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(`${effid}_Trigger1`),
        name: "紧急冻结推动",
        description: "紧急冻结推动",
        effect: "area_push",
        min_aoe: taoe,
        max_aoe: taoe,
        valid_targets: ["hostile"],
        shape: "blast",
        flags: ["SILENT", "NO_EXPLOSION_SFX"]
    };
    const tspell = {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(`${effid}_Trigger2`),
        name: "紧急冻结触发冻结",
        description: "紧急冻结触发冻结",
        effect: "mod_moves",
        min_damage: -1000,
        max_damage: -1000,
        min_aoe: taoe,
        max_aoe: taoe,
        valid_targets: ["hostile"],
        shape: "blast",
        extra_effects: [{ id: tex.id }, { id: tex.id }, { id: tex.id }, { id: tex.id }, { id: tex.id }]
    };
    const freeze = {
        type: "effect_type",
        id: (0, ModDefine_1.genEffectID)(`${effid}_Trigger3_Freeze`),
        name: ["冰封"],
        desc: ["无视所有伤害"],
        enchantments: [{
                condition: "ALWAYS",
                values: [{
                        value: "FORCEFIELD",
                        add: 1
                    }]
            }]
    };
    const tfreeze = {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(`${effid}_Trigger3`),
        name: "紧急冻结无敌",
        description: "紧急冻结无敌",
        effect: "attack",
        effect_str: freeze.id,
        min_duration: 800,
        valid_targets: ["self"],
        shape: "blast",
        flags: ["SILENT", "NO_EXPLOSION_SFX"]
    };
    const eff = {
        type: "effect_type",
        id: effid,
        name: ["紧急冻结"],
        desc: ["即将死亡时会将血量完全恢复, 无敌8秒, 并击退且冻结周围敌人。"],
        max_intensity: 1
    };
    const teoc = (0, UtilGener_1.genTriggerEffect)(dm, eff, "CnpcDeathPrev", "-1", [
        { u_cast_spell: { id: tex.id } },
        { u_cast_spell: { id: tspell.id } },
        { u_cast_spell: { id: tfreeze.id } },
        { u_set_hp: 1000, max: true },
        { math: ["u_pain()", "=", "0"] },
        { sound_effect: "IceHit", id: "BaseAudio", volume: 100 }
    ], "PERMANENT");
    dm.addStaticData([tex, tspell, tfreeze, freeze, eff, teoc], "common_resource", "trigger_effect", "EmergencyFreeze");
}
