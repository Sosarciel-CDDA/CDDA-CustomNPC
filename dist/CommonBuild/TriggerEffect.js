"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTriggerEffect = void 0;
const cdda_schema_1 = require("cdda-schema");
const CMDefine_1 = require("../CMDefine");
const UtilGener_1 = require("./UtilGener");
const StaticData_1 = require("../StaticData");
/**回复收到的伤害 */
//const regenDmg = {npc_set_hp:{arithmetic:[{npc_val:"hp",bodypart:{context_val:"bp"}} as any,"+",{context_val:"damage_taken"}]}};
//const regenDmg = {math:["n_hp(_bp)","+=","_damage_taken"]} as any;
async function createTriggerEffect(dm) {
    await FrostShield(dm);
    await EmergencyFreeze(dm);
    await HealReserve(dm);
}
exports.createTriggerEffect = createTriggerEffect;
/**触发效果持续时间 */
const TEFF_DUR = '60 s';
/**刷新触发的效果持续时间 */
const UPG_TEFF_DUR = '20 s';
const TEFF_MAX = 1000000;
//霜盾
function FrostShield(dm) {
    const taoe = 3;
    const effid = "FrostShield";
    const tex = {
        type: "SPELL",
        id: CMDefine_1.CMDef.genSpellID(`${effid}_Trigger1`),
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
        id: CMDefine_1.CMDef.genSpellID(`${effid}_Trigger2`),
        name: "霜盾触发冻结",
        description: "霜盾触发冻结",
        effect: "attack",
        min_damage: 2,
        max_damage: 2,
        damage_type: "Freeze",
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
//紧急冻结
function EmergencyFreeze(dm) {
    const taoe = 5;
    const effid = "EmergencyFreeze";
    const tex = {
        type: "SPELL",
        id: CMDefine_1.CMDef.genSpellID(`${effid}_Trigger1`),
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
        id: CMDefine_1.CMDef.genSpellID(`${effid}_Trigger2`),
        name: "紧急冻结触发冻结",
        description: "紧急冻结触发冻结",
        effect: "attack",
        min_damage: 10,
        max_damage: 10,
        damage_type: "Freeze",
        min_aoe: taoe,
        max_aoe: taoe,
        valid_targets: ["hostile"],
        shape: "blast",
        extra_effects: [{ id: tex.id }, { id: tex.id }, { id: tex.id }, { id: tex.id }, { id: tex.id }]
    };
    const freeze = {
        type: "effect_type",
        id: CMDefine_1.CMDef.genEffectID(`${effid}_Trigger3_Freeze`),
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
        id: CMDefine_1.CMDef.genSpellID(`${effid}_Trigger3`),
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
    const teoc = (0, UtilGener_1.genTriggerEffect)(dm, eff, "DeathPrev", "-1", [
        { run_eocs: StaticData_1.FULL_RECIVERY_EOCID },
        { u_cast_spell: { id: tex.id } },
        { u_cast_spell: { id: tspell.id } },
        { u_cast_spell: { id: tfreeze.id } },
        { sound_effect: "IceHit", id: "BaseAudio", volume: 100 }
    ], "PERMANENT");
    dm.addStaticData([tex, tspell, tfreeze, freeze, eff, teoc], "common_resource", "trigger_effect", "EmergencyFreeze");
}
//治疗储备
function HealReserve(dm) {
    const effid = "HealReserve";
    const eff = {
        type: "effect_type",
        id: effid,
        name: ["治疗储备"],
        desc: ["治疗储备"],
        max_intensity: TEFF_MAX,
        max_duration: TEFF_DUR
    };
    const teoc = (0, UtilGener_1.genTriggerEffect)(dm, eff, "BattleUpdate", "none", [
        ...cdda_schema_1.BodyPartList.map((bpid) => {
            const eff = {
                "if": { math: [`u_hp('${bpid}')`, "<", `u_hp_max('${bpid}')`] },
                then: [
                    { math: ["_needheal", "=", `u_hp_max('${bpid}') - u_hp('${bpid}')`] },
                    { math: ["_effstk", "=", `u_effect_intensity('${effid}')`] },
                    { math: ["_healcount", "=", `_needheal > _effstk ? _effstk : _needheal`] },
                    { math: [`u_hp('${bpid}')`, "+=", `_healcount`] },
                    { u_add_effect: effid, intensity: { math: [`_effstk - _healcount`] }, duration: UPG_TEFF_DUR },
                ]
            };
            return eff;
        }),
        { math: ["u_pain()", "=", "0"] },
    ], UPG_TEFF_DUR, undefined, undefined);
    dm.addStaticData([eff, teoc], "common_resource", "trigger_effect", "HealReserve");
}
