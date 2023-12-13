import { DataManager } from "@src/DataManager";
import { BoolObj, DamageTypeID, EffectID, Eoc, EocEffect, InlineEoc, NumObj, ParamsEoc, Spell, SpellFlag, Time } from "cdda-schema";
import { CharSkill, parseNumObj } from "./CharSkill";
import { genEOCID, genSpellID } from "ModDefine";
import { CON_SPELL_FLAG, SPELL_MAX_DAMAGE } from "StaticData";





/**子项数据 */
export type SpecSkillCastData=Readonly<{
    /**技能 */
    skill:CharSkill;
    /**基础成功eoc效果 */
    TEffect:EocEffect[];
    /**基础准备释放Eoc */
    PreEffect:EocEffect[];
    /**子法术 */
    extraEffects:Spell[];
}>


/**添加效果 */
type AddEffect = {
    /**生成一个添加效果的子法术 */
    type:"AddEffect";
    /**效果ID */
    effect_id:EffectID;
    /**效果强度 */
    intensity: (NumObj);
    /**持续时间 数字为秒 */
    duration: (Time)|NumObj;
    /**添加效果后的额外效果 */
    effect?:EocEffect[];
    /**是否叠加强度 默认覆盖 */
    is_stack?:boolean;
}
/**以受害者为 u_ 运行EOC */
type RunEoc = {
    /**生成一个运行的子法术 */
    type        :"RunEoc";
    /**运行的Eoc */
    eoc         : (ParamsEoc);
    /**自动生成eoc并运行 */
    effect?     :EocEffect[];
    /**自动生成的eoc的运行条件 */
    condition?  : (BoolObj);
}
/**额外造成某种类型的伤害 */
type ExtDamage = {
    /**额外伤害 */
    type: "ExtDamage";
    /**伤害量 */
    amount: (NumObj);
    /**伤害类型id */
    damage_type: DamageTypeID;
}

/**特殊的字效果 */
export type SpecEffect = RunEoc|AddEffect|ExtDamage;
/**特殊效果的处理表 */
export const SpecProcMap:Record<SpecEffect["type"],(dm:DataManager,charName:string,baseSkillData:SpecSkillCastData,spec:SpecEffect,index:number)=>void>={
    AddEffect   :processAddEffect   ,
    RunEoc      :processRunEoc      ,
    ExtDamage   :processExtDamage   ,
}


function processAddEffect(dm:DataManager,charName:string,baseSkillData:SpecSkillCastData,spec:SpecEffect,index:number){
    const {skill,TEffect,PreEffect,extraEffects} = baseSkillData;
    const {spell,one_in_chance} = skill;
    spec = spec as AddEffect;

    const mainid = `${spell.id}_${index}_AddEffect`;

    const intVar = `${mainid}_intensity`;
    PreEffect.push({math:[intVar,"=",parseNumObj(spec.intensity)]})
    let fixdur = spec.duration;
    if(typeof fixdur!="string" && typeof fixdur!="number"){
        const durVar = `${mainid}_duration`;
        PreEffect.push({math:[durVar,"=",parseNumObj(fixdur)]});
        fixdur = {math:[durVar]};
    }

    const addEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(mainid),
        eoc_type:"ACTIVATION",
        effect:[
            spec.is_stack==true
            ? {u_add_effect:spec.effect_id,duration:fixdur,intensity:{math:[`max(u_effect_intensity('${spec.effect_id}'),0) + ${intVar}`]}}
            : {u_add_effect:spec.effect_id,duration:fixdur,intensity:{math:[intVar]}},
            ...spec.effect??[]
        ]
    }
    dm.addSharedRes(addEoc.id,addEoc,"common_resource","common_spell_assist");

    const flags:SpellFlag[] = [...CON_SPELL_FLAG];
    if(spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS")

    const {min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        max_level,shape,valid_targets,
        targeted_monster_ids,targeted_monster_species} = spell;

    extraEffects.push({
        type:"SPELL",
        id:genSpellID(mainid),
        effect:"effect_on_condition",
        effect_str:addEoc.id,
        name:`${spell.name}_${index}_AddEffect`,
        description:spell.name+"的添加效果子法术",
        min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        max_level,shape,valid_targets,
        targeted_monster_ids,targeted_monster_species,flags
    })
};
function processRunEoc(dm:DataManager,charName:string,baseSkillData:SpecSkillCastData,spec:SpecEffect,index:number){
    const {skill,TEffect,PreEffect,extraEffects} = baseSkillData;
    const {spell,one_in_chance} = skill;
    spec=spec as RunEoc;

    const mainid = `${spell.id}_${index}_RunEoc`;

    const runEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(mainid),
        eoc_type:"ACTIVATION",
        effect:[]
    }
    if(spec.eoc!=undefined)
        runEoc.effect?.push({run_eocs:spec.eoc});
    if(spec.effect!=undefined){
        let inline:InlineEoc={
            id:genEOCID(`${mainid}_inline`),
            eoc_type:"ACTIVATION",
            effect:spec.effect,
        }
        if(spec.condition!=undefined)
            inline.condition=spec.condition;
        runEoc.effect?.push({run_eocs:inline})
    }
    dm.addSharedRes(runEoc.id,runEoc,"common_resource","common_spell_assist");

    const flags:SpellFlag[] = [...CON_SPELL_FLAG];
    if(spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS")

    const {min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        max_level,shape,valid_targets,
        targeted_monster_ids,targeted_monster_species} = spell;

    extraEffects.push({
        type:"SPELL",
        id:genSpellID(mainid),
        effect:"effect_on_condition",
        effect_str:runEoc.id,
        name:`${spell.name}_${index}_RunEoc`,
        description:spell.name+"运行Eoc子法术",
        min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        max_level,shape,valid_targets,
        targeted_monster_ids,targeted_monster_species,flags
    })
};
function processExtDamage(dm:DataManager,charName:string,baseSkillData:SpecSkillCastData,spec:SpecEffect,index:number){
    const {skill,TEffect,PreEffect,extraEffects} = baseSkillData;
    const {spell,one_in_chance} = skill;
    spec=spec as ExtDamage;

    const mainid = `${spell.id}_${index}_ExtDamage`;

    const flags:SpellFlag[] = [...CON_SPELL_FLAG];
    if(spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS")

    const {min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        max_level,shape,valid_targets,
        targeted_monster_ids,targeted_monster_species} = spell;

    extraEffects.push({
        type:"SPELL",
        id:genSpellID(mainid),
        effect:"attack",
        name:`${spell.name}_${index}_ExtDamage`,
        description:spell.name+"额外伤害子法术",
        min_damage:{math:[parseNumObj(spec.amount)]},
        max_damage:SPELL_MAX_DAMAGE,
        damage_type:spec.damage_type,
        min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        max_level,shape,valid_targets,
        targeted_monster_ids,targeted_monster_species,flags
    })
};