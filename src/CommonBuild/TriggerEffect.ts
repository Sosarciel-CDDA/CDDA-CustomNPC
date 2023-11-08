import { DataManager } from "@src/DataManager";
import { DamageType, DamageTypeID, Effect, EffectID, Enchantment, Eoc, EocID, Spell } from "CddaJsonFormat";
import { genEOCID, genEffectID, genEnchantmentID, genSpellID } from "ModDefine";
import { genAddEffEoc, genDIO, genTriggerEffect } from "./UtilGener";

/**回复收到的伤害 */
//const regenDmg = {npc_set_hp:{arithmetic:[{npc_val:"hp",bodypart:{context_val:"bp"}} as any,"+",{context_val:"damage_taken"}]}};
//const regenDmg = {math:["n_hp(_bp)","+=","_damage_taken"]} as any;

export async function createTriggerEffect(dm:DataManager){
    await FrostShield(dm);
    await EmergencyFreeze(dm);
}

const TEFF_DUR = '60 s';
const TEFF_MAX = 1000000;

//霜盾
function FrostShield(dm:DataManager){
    const taoe = 3;
    const effid = "FrostShield" as EffectID;
    const tex:Spell={
        type:"SPELL",
        id:genSpellID(`${effid}_Trigger1`),
        name:"霜盾触发推动",
        description:"霜盾触发推动",
        effect:"area_push",
        min_aoe:taoe,
        max_aoe:taoe,
        valid_targets:["hostile"],
        shape:"blast",
        flags:["SILENT","NO_EXPLOSION_SFX"]
    }
    const tspell:Spell={
        type:"SPELL",
        id:genSpellID(`${effid}_Trigger2`),
        name:"霜盾触发冻结",
        description:"霜盾触发冻结",
        effect:"attack",
        min_damage: 2,
        max_damage: 2,
        damage_type:"Freeze" as DamageTypeID,
        min_aoe:taoe,
        max_aoe:taoe,
        valid_targets:["hostile"],
        shape:"blast",
        extra_effects: [{id:tex.id},{id:tex.id},{id:tex.id}]
    }
    const eff:Effect = {
        type:"effect_type",
        id: effid,
        name:["霜盾"],
        desc:["受到攻击时会无视伤害, 并击退且冻结周围敌人。"],
        max_intensity:TEFF_MAX,
        max_duration:TEFF_DUR,
        enchantments:[{
            condition:"ALWAYS",
            values:[{
                value:"FORCEFIELD",
                add:1
            }]
        }]
    }
    const teoc = genTriggerEffect(dm,eff,"TakeDamage","-1",[
        {u_cast_spell:{id:tex.id}},
        {u_cast_spell:{id:tspell.id}},
        {sound_effect:"IceHit",id:"BaseAudio",volume:100}
    ],TEFF_DUR,undefined,"1 s");
    dm.addStaticData([tex,tspell,eff,teoc],"common_resource","trigger_effect","FrostShield");
}


//紧急冻结
function EmergencyFreeze(dm:DataManager){
    const taoe = 5;
    const effid = "EmergencyFreeze" as EffectID;
    const tex:Spell={
        type:"SPELL",
        id:genSpellID(`${effid}_Trigger1`),
        name:"紧急冻结推动",
        description:"紧急冻结推动",
        effect:"area_push",
        min_aoe:taoe,
        max_aoe:taoe,
        valid_targets:["hostile"],
        shape:"blast",
        flags:["SILENT","NO_EXPLOSION_SFX"]
    }
    const tspell:Spell={
        type:"SPELL",
        id:genSpellID(`${effid}_Trigger2`),
        name:"紧急冻结触发冻结",
        description:"紧急冻结触发冻结",
        effect:"attack",
        min_damage: 10,
        max_damage: 10,
        damage_type:"Freeze" as DamageTypeID,
        min_aoe:taoe,
        max_aoe:taoe,
        valid_targets:["hostile"],
        shape:"blast",
        extra_effects: [{id:tex.id},{id:tex.id},{id:tex.id},{id:tex.id},{id:tex.id}]
    }
    const freeze:Effect={
        type:"effect_type",
        id:genEffectID(`${effid}_Trigger3_Freeze`),
        name:["冰封"],
        desc:["无视所有伤害"],
        enchantments:[{
            condition:"ALWAYS",
            values:[{
                value:"FORCEFIELD",
                add:1
            }]
        }]
    }
    const tfreeze:Spell={
        type:"SPELL",
        id:genSpellID(`${effid}_Trigger3`),
        name:"紧急冻结无敌",
        description:"紧急冻结无敌",
        effect:"attack",
        effect_str:freeze.id,
        min_duration:800,
        valid_targets:["self"],
        shape:"blast",
        flags:["SILENT","NO_EXPLOSION_SFX"]
    }
    const eff:Effect = {
        type:"effect_type",
        id: effid,
        name:["紧急冻结"],
        desc:["即将死亡时会将血量完全恢复, 无敌8秒, 并击退且冻结周围敌人。"],
        max_intensity:1
    }
    const teoc = genTriggerEffect(dm,eff,"CnpcDeathPrev","-1",[
        "u_prevent_death",
        {u_set_hp:1000,max:true},
        {u_cast_spell:{id:tex.id}},
        {u_cast_spell:{id:tspell.id}},
        {u_cast_spell:{id:tfreeze.id}},
        {math:[ "u_pain()", "=", "0" ] },
        {sound_effect:"IceHit",id:"BaseAudio",volume:100}
    ],"PERMANENT");
    dm.addStaticData([tex,tspell,tfreeze,freeze,eff,teoc],"common_resource","trigger_effect","EmergencyFreeze");
}