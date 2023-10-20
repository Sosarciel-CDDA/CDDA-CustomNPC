import { DataManager } from "@src/DataManager";
import { Effect, EffectID, Enchantment, Spell } from "CddaJsonFormat";
import { genEOCID, genEffectID, genEnchantmentID, genSpellID } from "ModDefine";
import { genAddEffEoc, genTriggerEffect } from "./UtilGener";
import { SPELL_MAX_DAMAGE } from "StaticData";



export async function createTriggerEffect(dm:DataManager){
    await FrostShield(dm);
    await Electrify(dm);
}

const TEFF_DUR = '60 s';
const TEFF_MAX = 100000;

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
        effect:"mod_moves",
        min_damage:-200,
        max_damage:-200,
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
    const teoc = genTriggerEffect(dm,eff,"TakeDamage",[
        {u_cast_spell:{id:tex.id}},
        {u_cast_spell:{id:tspell.id}},
        {sound_effect:"IceHit",id:"BaseAudio",volume:100}
    ],TEFF_DUR,undefined,"1 s");
    const mainEoc = genAddEffEoc(effid,TEFF_DUR);
    dm.addStaticData([tex,tspell,eff,teoc,mainEoc],"common_resource","trigger_effect","FrostShield");
}

//感电
function Electrify(dm:DataManager){
    const effid = "Electrify" as EffectID;
    const tspell:Spell={
        type:"SPELL",
        id:genSpellID(`${effid}_Trigger`),
        name:"感电触发伤害",
        description:"感电触发伤害",
        effect:"attack",
        min_damage:{math:[`u_effect_intensity('${effid}')*100`]},
        max_damage:SPELL_MAX_DAMAGE,
        valid_targets:["self"],
        shape:"blast",
        damage_type:"electric",
    }
    const ench:Enchantment={
        type:"enchantment",
        id:genEnchantmentID(`${effid}_Ench`),
        condition:"ALWAYS",
        intermittent_activation:{
            effects:[{
                frequency:"1 s",
                spell_effects:[
                    {id:tspell.id,hit_self:true}
                ]
            }]
        }
    }
    const eff:Effect = {
        type:"effect_type",
        id: effid,
        name:["感电"],
        desc:["每次受到感电效果时, 受到一次相当于感电层数的伤害, 每次触发后感电层数减半"],
        max_intensity:TEFF_MAX,
        max_duration:TEFF_DUR,
        enchantments:[ench.id]
    }
    const mainEoc = genAddEffEoc(effid,TEFF_DUR,[
        //{u_cast_spell:{id:tspell.id,hit_self:true}},
        //{u_add_effect:effid,intensity:{math:[`u_effect_intensity('${effid}')/2`]},duration:TEFF_DUR},
        {sound_effect:"ElectHit",id:"BaseAudio",volume:100}
    ]);
    dm.addStaticData([tspell,ench,eff,mainEoc],"common_resource","trigger_effect","Electrify");
}

//创伤
function Trauma(dm:DataManager){
    const effid = "Trauma" as EffectID;
    const tspell:Spell={
        type:"SPELL",
        id:genSpellID(`${effid}_Trigger`),
        name:"创伤触发伤害",
        description:"创伤触发伤害",
        effect:"attack",
        min_damage:{math:[`u_effect_intensity('${effid}')`]},
        max_damage:SPELL_MAX_DAMAGE,
        valid_targets:["self"],
        shape:"blast",
        damage_type:"cut",
    }
    const eff:Effect = {
        type:"effect_type",
        id: effid,
        name:["创伤"],
        desc:["每次受到创伤效果时, 受到一次相当于创伤层数的伤害, 每次触发后创伤层数减半"],
        max_intensity:TEFF_MAX,
        max_duration:TEFF_DUR,
    }
    const mainEoc = genAddEffEoc(effid,TEFF_DUR,[
        {u_cast_spell:{id:tspell.id,hit_self:true}},
        {u_add_effect:effid,intensity:{math:[`u_effect_intensity('${effid}')/2`]},duration:TEFF_DUR},
        {sound_effect:"ElectHit",id:"BaseAudio",volume:100}
    ]);
    dm.addStaticData([tspell,eff,mainEoc],"common_resource","trigger_effect","Trauma");
}