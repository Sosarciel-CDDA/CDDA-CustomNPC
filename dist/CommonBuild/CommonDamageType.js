"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDamageType = void 0;
const ModDefine_1 = require("../ModDefine");
const UtilGener_1 = require("./UtilGener");
const StaticData_1 = require("../StaticData");
async function createDamageType(dm) {
    await Electrify(dm);
    await Discharge(dm);
    await Trauma(dm);
    await Laceration(dm);
    await Freeze(dm);
}
exports.createDamageType = createDamageType;
const TEFF_MAX = 1000000;
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
        max_duration: dur,
        show_in_info: true,
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${effid}_OnDamage`),
        effect: [
            //regenDmg,
            { u_message: "感电触发 <context_val:total_damage> <context_val:damage_taken>" },
            {
                npc_add_effect: effid,
                duration: dur,
                intensity: { math: [`n_effect_intensity('${effid}') + (_total_damage * (n_effect_intensity('${extid}')>0? 4 : 1))`] }
            },
        ],
        condition: { math: ["_total_damage", ">", "0"] }
    };
    const dt = {
        id: effid,
        type: "damage_type",
        name: "感电",
        magic_color: "yellow",
        derived_from: ["electric", 0],
        ondamage_eocs: [onDmgEoc.id]
    };
    //串流
    const exteff = {
        type: "effect_type",
        id: extid,
        name: ["串流"],
        desc: ["感电 叠加的层数变为 4 倍。"],
        max_intensity: 1,
        max_duration: dur,
        show_in_info: true,
    };
    dm.addStaticData([eff, onDmgEoc, dt, exteff, (0, UtilGener_1.genDIO)(dt)], "common_resource", "damage_type", "Electrify");
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
            //regenDmg,
            { u_message: "放电触发 <context_val:total_damage> <context_val:damage_taken>" },
            { math: ["tmpDischargeDmg", "=", "_total_damage/10"] },
            { npc_cast_spell: { id: tspell.id, hit_self: true } },
            { npc_lose_effect: dmgeffid },
        ],
        condition: { math: ["_total_damage", ">", "0"] }
    };
    const dt = {
        id: effid,
        type: "damage_type",
        name: "放电",
        magic_color: "yellow",
        ondamage_eocs: [onDmgEoc.id],
        no_resist: true
    };
    dm.addStaticData([onDmgEoc, dt, tspell, (0, UtilGener_1.genDIO)(dt)], "common_resource", "damage_type", "Discharge");
}
//创伤
function Trauma(dm) {
    const effid = "Trauma";
    const extid = "HeavyTrauma";
    const stackcount = TEFF_MAX;
    const dur = "15 s";
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
        damage_type: "stab",
    };
    const eff = {
        type: "effect_type",
        id: effid,
        name: ["创伤"],
        desc: [`每秒受到一次相当于 创伤层数 的伤害。`],
        apply_message: "一道伤口正在蚕食着你的躯体",
        base_mods: {
            hurt_min: [1],
            hurt_tick: [1]
        },
        scaling_mods: {
            hurt_min: [1]
        },
        max_intensity: stackcount,
        max_duration: dur,
        show_in_info: true,
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${effid}_OnDamage`),
        effect: [
            //regenDmg,
            { u_message: "创伤触发 <context_val:total_damage> <context_val:damage_taken>" },
            { npc_add_effect: effid, duration: dur, intensity: { math: [`n_effect_intensity('${effid}') +  (_total_damage * (n_effect_intensity('${extid}')>0? 1.5 : 1))`] } }
        ],
        condition: { math: ["_total_damage", ">", "0"] }
    };
    const dt = {
        id: effid,
        type: "damage_type",
        name: "创伤",
        physical: true,
        magic_color: "white",
        derived_from: ["stab", 0],
        ondamage_eocs: [onDmgEoc.id],
        edged: true,
    };
    //串流
    const exteff = {
        type: "effect_type",
        id: extid,
        name: ["重创"],
        desc: ["创伤 叠加的层数变为 1.5 倍。"],
        max_intensity: 1,
        max_duration: dur,
        show_in_info: true,
    };
    dm.addStaticData([tspell, eff, onDmgEoc, dt, (0, UtilGener_1.genDIO)(dt), exteff], "common_resource", "damage_type", "Trauma");
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
        damage_type: "stab",
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${effid}_OnDamage`),
        effect: [
            //regenDmg,
            { u_message: "撕裂触发 <context_val:total_damage> <context_val:damage_taken>" },
            { math: ["tmpLacerationDmg", "=", "_total_damage/10"] },
            { npc_cast_spell: { id: tspell.id, hit_self: true } },
        ],
        condition: { math: ["_total_damage", ">", "0"] }
    };
    const dt = {
        id: effid,
        type: "damage_type",
        name: "撕裂",
        magic_color: "white",
        ondamage_eocs: [onDmgEoc.id],
        no_resist: true,
    };
    dm.addStaticData([onDmgEoc, dt, tspell, (0, UtilGener_1.genDIO)(dt)], "common_resource", "damage_type", "Laceration");
}
//冻结
function Freeze(dm) {
    const did = "Freeze";
    const dname = "冻结";
    const tspell = {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)(`${did}_Trigger`),
        name: "冻结触发",
        description: "冻结触发",
        effect: "mod_moves",
        min_damage: { math: [`tmp${did}Dmg`] },
        max_damage: StaticData_1.SPELL_MAX_DAMAGE,
        valid_targets: ["self"],
        shape: "blast"
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${did}_OnDamage`),
        effect: [
            { u_message: `${dname} 触发 <context_val:total_damage> <context_val:damage_taken>` },
            { math: [`tmp${did}Dmg`, "=", "0 - (_total_damage*100)"] },
            { npc_cast_spell: { id: tspell.id, hit_self: true } },
        ],
        condition: { math: ["_total_damage", ">", "0"] }
    };
    const dt = {
        id: did,
        type: "damage_type",
        name: dname,
        magic_color: "light_blue",
        ondamage_eocs: [onDmgEoc.id],
        no_resist: true
    };
    dm.addStaticData([onDmgEoc, dt, tspell, (0, UtilGener_1.genDIO)(dt)], "common_resource", "damage_type", "Discharge");
}
