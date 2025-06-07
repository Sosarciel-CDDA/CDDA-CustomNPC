import { CDataManager } from "@src/DataManager";
import { BoolObj, DamageTypeID, EffectID, Eoc, EocEffect, InlineEoc, NumObj, ParamsEoc, SoundEffectID, SoundEffectVariantID, Spell, SpellFlag, Time } from "@sosarciel-cdda/sclema";
import { CharSkill, parseNumObj } from "./CharSkill";
import { CMDef } from "CMDefine";
import { CON_SPELL_FLAG, SPELL_MAX_DAMAGE } from "StaticData";
import { JObject } from "@zwa73/utils";





/**子项数据 */
export type SpecSkillCastData=Readonly<{
    /**技能 */
    skill:CharSkill;
    /**子法术 */
    extra_effects:Spell[];
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
    eoc        ?: (ParamsEoc);
    /**自动生成eoc并运行 */
    effect?     : EocEffect[];
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
/**产生音效 */
type Audio = {
    /**音频 */
    type: "Audio";
    audio:(string|{
        /**音效变体ID */
        id:string,
        /**产生音效的概率 1/n 默认1 */
        one_in_chance?:number,
        /**音量 1-128 默认100 */
        volume?:number,
        /**声音冷却  
         * 每隔n次战斗刷新可触发
         */
        cooldown?:number;
    })[]
}

/**特殊的字效果 */
export type SpecEffect = [
    RunEoc   ,
    AddEffect,
    ExtDamage,
    Audio    ,
][number];

/**特殊效果的处理表 */
export const SpecProcMap:Record<SpecEffect["type"],(dm:CDataManager,charName:string,baseSkillData:SpecSkillCastData,spec:SpecEffect,index:number)=>void>={
    AddEffect   :processAddEffect   ,
    RunEoc      :processRunEoc      ,
    ExtDamage   :processExtDamage   ,
    Audio       :processAudio       ,
}


const genMainID = (skill:CharSkill,spec:SpecEffect,index:number) => `${skill.spell.id}_${spec.type}_${index}`

function processAddEffect(dm:CDataManager,charName:string,baseSkillData:SpecSkillCastData,spec:SpecEffect,index:number){
    const {skill,extra_effects} = baseSkillData;
    const {spell} = skill;
    spec = spec as AddEffect;

    const mainid = genMainID(skill,spec,index);

    const addEoc:Eoc={
        type:"effect_on_condition",
        id:CMDef.genEOCID(mainid),
        eoc_type:"ACTIVATION",
        effect:[
            spec.is_stack==true
            ? {u_add_effect:spec.effect_id,duration:spec.duration,intensity:{math:[`max(u_effect_intensity('${spec.effect_id}'),0) + ${parseNumObj(spec.intensity)}`]}}
            : {u_add_effect:spec.effect_id,duration:spec.duration,intensity:{math:[parseNumObj(spec.intensity)]}},
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

    extra_effects.push({
        type:"SPELL",
        id:CMDef.genSpellID(mainid),
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
function processRunEoc(dm:CDataManager,charName:string,baseSkillData:SpecSkillCastData,spec:SpecEffect,index:number){
    const {skill,extra_effects} = baseSkillData;
    const {spell} = skill;
    spec=spec as RunEoc;

    const mainid = genMainID(skill,spec,index);

    const runEoc:Eoc={
        type:"effect_on_condition",
        id:CMDef.genEOCID(mainid),
        eoc_type:"ACTIVATION",
        effect:[]
    }
    if(spec.eoc!=undefined)
        runEoc.effect?.push({run_eocs:spec.eoc});
    if(spec.effect!=undefined){
        let inline:InlineEoc={
            id:CMDef.genEOCID(`${mainid}_inline`),
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

    extra_effects.push({
        type:"SPELL",
        id:CMDef.genSpellID(mainid),
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
function processExtDamage(dm:CDataManager,charName:string,baseSkillData:SpecSkillCastData,spec:SpecEffect,index:number){
    const {skill,extra_effects} = baseSkillData;
    const {spell} = skill;
    spec=spec as ExtDamage;

    const mainid = genMainID(skill,spec,index);

    const flags:SpellFlag[] = [...CON_SPELL_FLAG];
    if(spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS")

    const {min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        max_level,shape,valid_targets,
        targeted_monster_ids,targeted_monster_species} = spell;

    extra_effects.push({
        type:"SPELL",
        id:CMDef.genSpellID(mainid),
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
function processAudio(dm:CDataManager,charName:string,baseSkillData:SpecSkillCastData,spec:SpecEffect,index:number){
    const {skill,extra_effects} = baseSkillData;
    const {spell} = skill;
    spec=spec as Audio;

    const mainid = genMainID(skill,spec,index);

    const {audio} = spec;
    /**解析音频id */
    function parseAudioString(charName:string,str:string,volume:number=100):EocEffect{
        let soundName = charName;
        let varName = str;
        if(str.includes(":")){
            const match = str.match(/(.+):(.+)/);
            if(match==null) throw `parseAudioString 解析错误 字符串:${str}`;
            soundName = match[1];
            varName = match[2];
        }
        return {
            sound_effect:varName    as SoundEffectVariantID ,
            id          :soundName  as SoundEffectID        ,
            volume
        };
    }
    function procAudio(audio:(Audio["audio"])):EocEffect[]{
        return audio.map((audioObj)=>{
            if(typeof audioObj == "string")
                return parseAudioString(charName,audioObj);
            //冷却变量ID
            const cdid = `u_audio_${audioObj.id}_cooldown`;
            if(audioObj.cooldown){
                //冷却
                const cdeoc=CMDef.genActEoc(cdid,[{math:[cdid,"-=","1"]}],{math:[cdid,">","0"]});
                dm.addInvokeEoc("BattleUpdate",0,cdeoc);
                dm.addSharedRes(cdeoc.id,cdeoc,"common_resource","common_spell_assist");
                //初始化
                const initeoc=CMDef.genActEoc(cdid+"_init",[{math:[cdid,"=","0"]}]);
                dm.addInvokeEoc("EnterBattle",0,initeoc);
                dm.addSharedRes(initeoc.id,initeoc,"common_resource","common_spell_assist");
            }
            const effect:EocEffect = {
                run_eocs:{
                    id:CMDef.genEOCID(`${charName}_${audioObj.id}_Chance`),
                    eoc_type:"ACTIVATION",
                    condition:{and:[
                        {one_in_chance:audioObj.one_in_chance??1},
                        {math:[cdid,"<=","0"]}
                    ]},
                    effect:[
                        parseAudioString(charName,audioObj.id,audioObj.volume),
                        {math:[cdid,"=",(audioObj.cooldown??0)+""]}
                    ],
                }
            };
            return effect;
        })
    }

    const addEoc:Eoc={
        type:"effect_on_condition",
        id:CMDef.genEOCID(mainid),
        eoc_type:"ACTIVATION",
        effect:[...procAudio(audio)]
    }
    dm.addSharedRes(addEoc.id,addEoc,"common_resource","common_spell_assist");
    extra_effects.push({
        type:"SPELL",
        id:CMDef.genSpellID(mainid),
        effect:"effect_on_condition",
        name:`${spell.name}_${index}_Audio`,
        description:spell.name+"音效法术",
        effect_str:addEoc.id,
        valid_targets:["self"],
        shape:"blast"
    })
};