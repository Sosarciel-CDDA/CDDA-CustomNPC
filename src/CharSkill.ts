import { JArray, JObject } from "@zwa73/utils";
import { CON_SPELL_FLAG, genEOCID } from ".";
import { BoolObj, Eoc, EocEffect } from "./CddaJsonFormat/Eoc";
import { Spell, SpellID } from "./CddaJsonFormat/Spell";
import { DataManager } from "./DataManager";
import { TARGET_MON_ID } from "./StaticData/BaseMonster";
import { CharEvemtTypeList, CharEventType, ReverseCharEvemtTypeList, ReverseCharEventType } from "./Event";


/**技能选择目标类型 */
type TargetType = "random"|"spell_target"|"reverse_hit";
/**角色技能 */
export type CharSkill = {
    /**释放条件 */
    condition?      :BoolObj,
    /**时机 */
    hook            :CharEventType|ReverseCharEventType,
    /**瞄准方式
     * random 为 原版随机;  
     * spell_target 为 瞄准目标周围的 攻击时出现的法术标靶 仅适用于攻击触发的范围技能;  
     * reverse_hit 为 翻转命中 使目标使用此法术攻击自己 并用u_hp-=造成伤害 适用于单体技能  
     * hook 必须为翻转事件 CharCauseDamage | CharCauseMeleeDamage | CharCauseRangeDamage  
     * 除 reverse_hit 外无法使用翻转事件;  
     * 默认为根据施法目标自动选择 reverse_hit 不会被自动选择  
     */
    target?         :TargetType;
    /**权重 优先尝试触发高权重的spell 默认0 */
    weight?         :number,
    /**概率 有1/chance的几率使用这个技能 默认1 */
    one_in_chance?  :number,
    /**冷却时间 单位为每次CharUpdate 默认0 */
    cooldown?       :number,
    /**共同冷却时间 影响所有技能的释放 单位为每次CharUpdate 默认1  
     * 一个高权重0共同冷却的技能意味着可以同时触发  
     */
    common_cooldown?:number,
    /**法术效果 */
    spell           :Spell,
    /**技能音效 */
    audio?          :(string|{
        /**音效变体ID */
        id:string,
        /**产生音效的概率 1/n 默认1 */
        one_in_chance?:number,
        /**音量 1-128 默认100 */
        volume?:number,
    })[],
    /**要求强化字段 [字段,强化等级] */
    require_field?:[string,number];
};

//全局冷却字段名
const gcdValName = `u_CoCooldown`;

/**处理角色技能 */
export async function createCharSkill(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);
    const skills = (charConfig.skill||[]).sort((a,b)=>(b.weight||0)-(a.weight||0));
    const skillDataList:JObject[] = [];

    //全局冷却事件
    const GCDEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_CoCooldown`),
        effect:[
            {math:[gcdValName,"-=","1"]}
        ],
        condition:{math:[gcdValName,">","0"]},
        eoc_type:"ACTIVATION",
    }
    dm.addCharEvent(charName,"CharUpdate",0,GCDEoc);
    skillDataList.push(GCDEoc);


    //遍历技能
    for(const skill of skills){
        const {condition,spell,cooldown,common_cooldown,audio,require_field,target} = skill;


        //法术消耗字符串
        const spellCost = `min(${spell.base_energy_cost||0}+${spell.energy_increment||0}*`+
            `u_val('spell_level', 'spell: ${spell.id}'),${spell.final_energy_cost||999999})`;

        //生成冷却变量名
        const cdValName = `u_${spell.id}_Cooldown`;
        //计算基础条件
        const baseCond:BoolObj[] = [
            {math:[gcdValName,"<=","0"]}
        ];
        if(spell.base_energy_cost!=undefined)
            baseCond.push({math:["u_val('mana')",">=",spellCost]});
        if(condition)
            baseCond.push(condition);
        if(cooldown)
            baseCond.push({math:[cdValName,"<=","0"]});
        if(require_field)
            baseCond.push({math:[require_field[0],">=",require_field[1]+""]});

        //计算成功效果
        const TEffect:EocEffect[]=[];
        if(common_cooldown!=0)
            TEffect.push({math:[gcdValName,"=",`${common_cooldown||1}`]});
        if(spell.base_energy_cost!=undefined)
            TEffect.push({math:["u_val('mana')","-=",spellCost]});
        if(cooldown)
            TEffect.push({math:[cdValName,"=",`${cooldown||0}`]});
        if(audio){
            TEffect.push(...audio.map(audioObj=>{
                if(typeof audioObj == "string")
                    return ({sound_effect:audioObj,id:charName,volume:100});

                const effect:EocEffect = {
                    run_eocs:{
                        id:genEOCID(`${charName}_${audioObj.id}_Chance`),
                        eoc_type:"ACTIVATION",
                        condition:{one_in_chance:audioObj.one_in_chance||1},
                        effect:[
                            {sound_effect:audioObj.id,id:charName,volume:audioObj.volume||100}
                        ],
                    }
                };
                return effect;
            }));
        }

        //基本通用数据
        const baseSkillData = {
            skill,
            TEffect,
            baseCond,
            spellCost,
        }


        //判断瞄准方式
        //是敌对目标法术
        const isHostileTarget = spell.valid_targets.includes("hostile");
        //是Aoe法术
        const isAoe = (spell.min_aoe!=null && spell.min_aoe!=0) ||
            (spell.aoe_increment!=null && spell.aoe_increment!=0);
        //判断瞄准方式
        const selectTarget:TargetType = target!=null
            ? target
            : (isHostileTarget && isAoe)
            ? "spell_target"
            : "random";

        //处理并加入输出
        skillDataList.push(...processMap[selectTarget](dm,charName,baseSkillData));

        //冷却事件
        if(cooldown!=null){
            const CDEoc:Eoc={
                type:"effect_on_condition",
                id:genEOCID(`${charName}_${spell.id}_Cooldown`),
                effect:[
                    {math:[cdValName,"-=","1"]}
                ],
                condition:{math:[cdValName,">","0"]},
                eoc_type:"ACTIVATION",
            }
            dm.addCharEvent(charName,"CharUpdate",0,CDEoc);
            skillDataList.push(CDEoc);
        }
    }

    outData['skill'] = skillDataList;
}

/**处理方式表 */
const processMap:Record<TargetType,(dm:DataManager,charName:string,baseSkillData:BaseSkillData)=>JObject[]>={
    "random"        : randomProcess,
    "spell_target"  : spell_targetProcess,
    "reverse_hit"   : reverse_hitProcess,
}

/**基础技能数据 */
type BaseSkillData=Readonly<{
    /**技能 */
    skill:CharSkill;
    /**基础释放eoc条件 */
    baseCond:BoolObj[];
    /**基础成功eoc效果 */
    TEffect:EocEffect[];
}>

function spell_targetProcess(dm:DataManager,charName:string,baseSkillData:BaseSkillData){
    const {skill,baseCond,TEffect} = baseSkillData;
    const {hook,spell,one_in_chance} = skill;

    //如果需要选择目标 创建索敌辅助法术
    const {min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        max_level,shape} = spell;
    const selTargetSpell = {
        id:(spell.id+"_SelTarget")as SpellID,
        type:"SPELL",
        name:spell.name+"_索敌",
        description:`${spell.name}的辅助索敌法术`,
        effect:"attack",
        flags:["WONDER","RANDOM_TARGET",...CON_SPELL_FLAG],
        min_damage: 1,
        max_damage: 1,
        valid_targets:["hostile"],
        targeted_monster_ids:[TARGET_MON_ID],
        min_aoe,max_aoe,aoe_increment,
        min_range,max_range,range_increment,
        shape,max_level,
        extra_effects:[{id:spell.id}],
    }

    //创建施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_Cast${spell.id}`),
        eoc_type:"ACTIVATION",
        effect:[
            {
                u_cast_spell:{
                    id:selTargetSpell.id,
                    once_in:one_in_chance,
                },
                targeted: true,
                true_eocs:{
                    id:genEOCID(`${charName}_${spell.id}TrueEoc`),
                    effect:[...TEffect],
                    eoc_type:"ACTIVATION",
                }
            }
        ],
        condition:{and:[...baseCond]},
    }

    //加入触发
    if(ReverseCharEvemtTypeList.includes(hook as any))
        throw `翻转事件只能应用于翻转命中`
    dm.addCharEvent(charName,hook as CharEventType,0,castEoc);

    return [spell,castEoc,selTargetSpell];
}

function randomProcess(dm:DataManager,charName:string,baseSkillData:BaseSkillData){
    const {skill,baseCond,TEffect} = baseSkillData;
    const {hook,spell,one_in_chance} = skill;

    //创建施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_Cast${spell.id}`),
        eoc_type:"ACTIVATION",
        effect:[
            {
                u_cast_spell:{
                    id:spell.id,
                    once_in:one_in_chance,
                },
                targeted: false,
                true_eocs:{
                    id:genEOCID(`${charName}_${spell.id}TrueEoc`),
                    effect:[...TEffect],
                    eoc_type:"ACTIVATION",
                }
            }
        ],
        condition:{and:[...baseCond]},
    }

    //加入触发
    if(ReverseCharEvemtTypeList.includes(hook as any))
        throw `翻转事件只能应用于翻转命中`
    dm.addCharEvent(charName,hook as CharEventType,0,castEoc);

    return [spell,castEoc];
}

function reverse_hitProcess(dm:DataManager,charName:string,baseSkillData:BaseSkillData){
    let {skill,baseCond,TEffect} = baseSkillData;
    const {hook,spell,one_in_chance} = skill;


    //解析伤害字符串
    let dmgstr = `0`;
    if(spell.min_damage!==undefined){
        if(typeof spell.min_damage == "number")
            dmgstr = spell.min_damage+"";
        else if("math" in spell.min_damage)
            dmgstr = spell.min_damage.math[0];
        else throw `翻转命中伤害只支持固定值number 或 math表达式`
    }
    spell.min_damage = 0;
    spell.max_damage = 0;

    //翻转u与n
    baseCond = JSON.parse(JSON.stringify(baseCond).replace(/(?<!\w)u_/g, 'n_'));
    TEffect = JSON.parse(JSON.stringify(TEffect).replace(/(?<!\w)u_/g, 'n_'));
    dmgstr = dmgstr.replace(/(?<!\w)u_/g, 'n_');


    //创建翻转的施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`Cast${spell.id}`),
        eoc_type:"ACTIVATION",
        effect:[
            {
                u_cast_spell:{
                    id:spell.id,
                    once_in:one_in_chance,
                    hit_self:true              //如果是翻转事件则需命中自身
                },
                true_eocs:{
                    id:genEOCID(`${spell.id}TrueEoc`),
                    effect:[
                        {math: [`dmgtmp` , `=` , dmgstr]},//预先计算伤害
                        {math: [ `u_hp()`, `-=`, `dmgtmp`]},
                        ...TEffect
                    ],
                    eoc_type:"ACTIVATION",
                }
            }
        ],
        condition:{and:[...baseCond]},
    }

    //加入触发
    if(CharEvemtTypeList.includes(hook as any))
        throw `翻转命中 所用的事件必须为 翻转事件`
    dm.addReverseCharEvent(charName,hook as ReverseCharEventType,0,castEoc);

    return [spell,castEoc];
}