import { JArray } from "@zwa73/utils";
import { ControlSpellFlags, genEOCID } from ".";
import { BoolObj, Eoc, EocEffect } from "./CddaJsonFormat/Eoc";
import { Spell, SpellID } from "./CddaJsonFormat/Spell";
import { CharEventType, DataManager } from "./DataManager";
import { TARGET_MON_ID } from "./StaticData/BaseMonster";


/**角色技能 */
export type CharSkill = {
    /**释放条件 */
    condition?      :BoolObj,
    /**时机 */
    hook            :CharEventType,
    /**权重 优先尝试触发高权重的spell 默认0 */
    weight?         :number,
    /**概率 有1/chance的几率使用这个技能 默认1 */
    one_in_chance?  :number,
    /**冷却时间 单位为每次CharUpdate 默认0 */
    cooldown?       :number,
    /**共同冷却时间 影响所有技能的释放 单位为每次CharUpdate 默认1 */
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
};


export async function createCharSkill(dm:DataManager,charName:string){
    const {baseData,outData,charConfig} = await dm.getCharData(charName);
    const skills = (charConfig.skill||[]).sort((a,b)=>(b.weight||0)-(a.weight||0));
    const skillDataList:JArray = [];

    //全局冷却
    const gcdValName = `u_CoCooldown`;
    //全局冷却事件
    const GCDEoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_CoCooldown`),
        effect:[
            {math:[gcdValName,"-=","1"]}
        ],
        condition:{math:[gcdValName,">=","0"]},
        eoc_type:"ACTIVATION",
    }
    dm.addCharEvent(charName,"CharUpdate",0,GCDEoc);
    skillDataList.push(GCDEoc);

    //魔力回复
    const MREoc:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_ManaRegen`),
        effect:[
            {math:["u_val('mana')","+=","10"]}
        ],
        condition:{math:["u_val('mana')","<","u_val('mana_max')"]},
        eoc_type:"ACTIVATION",
    }
    dm.addCharEvent(charName,"CharUpdate",0,MREoc);
    skillDataList.push(MREoc);


    //遍历技能
    for(const skill of skills){
        const {condition,hook,spell,one_in_chance,cooldown,audio,common_cooldown} = skill;
        //生成冷却变量名
        const cdValName = `u_${spell.id}_Cooldown`;
        //计算基础条件
        const baseCond:BoolObj[] = [];
        if(condition)
            baseCond.push(condition);
        if(cooldown)
            baseCond.push({math:[cdValName,"<=","0"]});

        //计算成功效果
        const TEffect:EocEffect[]=[];
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
        //是敌对目标法术
        const isHostileTarget = spell.valid_targets.includes("hostile");
        //是Aoe法术
        const isAoe = (spell.min_aoe!=null && spell.min_aoe!=0) ||
            (spell.aoe_increment!=null && spell.aoe_increment!=0);
        //如果需要选择目标 创建索敌辅助法术
        let selTargetSpell:Spell|null=null;
        if(isHostileTarget && isAoe){
            const {min_aoe,max_aoe,aoe_increment,
                min_range,max_range,range_increment,
                max_level,shape} = spell;
            selTargetSpell = {
                id:(spell.id+"_SelTarget")as SpellID,
                type:"SPELL",
                name:spell.name+"_索敌",
                description:`${spell.name}的辅助索敌法术`,
                effect:"attack",
                flags:["WONDER","RANDOM_TARGET","NO_EXPLOSION_SFX",...ControlSpellFlags],
                min_damage: 1,
                max_damage: 1,
                valid_targets:["hostile"],
                targeted_monster_ids:[TARGET_MON_ID],
                min_aoe,max_aoe,aoe_increment,
                min_range,max_range,range_increment,
                shape,max_level,
                extra_effects:[{id:spell.id}],
            }
        }

        //法术消耗字符串
        const costMathStr = `min(${spell.base_energy_cost||0}+${spell.energy_increment||0}*`+
            `u_val('spell_level', 'spell: ${spell.id}'),${spell.final_energy_cost||999999})`;

        //创建施法EOC
        const castEoc:Eoc={
            type:"effect_on_condition",
            id:genEOCID(`${charName}_Cast${spell.id}`),
            eoc_type:"ACTIVATION",
            effect:[
                {
                    u_cast_spell:{
                        id:selTargetSpell?.id||spell.id,
                        once_in:one_in_chance,
                    },
                    targeted: selTargetSpell? true:false,
                    true_eocs:{
                        id:genEOCID(`${charName}_${spell.id}TrueEoc`),
                        effect:[
                            {math:["u_val('mana')","-=",costMathStr]},
                            {math:[gcdValName,"=",`${common_cooldown||1}`]},
                            ...TEffect
                        ],
                        eoc_type:"ACTIVATION",
                    }
                }
            ],
            condition:{and:[
                {math:["u_val('mana')",">=",costMathStr]},
                {math:[gcdValName,"<=","0"]},
                ...baseCond]},
        }

        //加入触发
        dm.addCharEvent(charName,hook,0,castEoc);
        skillDataList.push(castEoc,spell);
        if(selTargetSpell!=null)
            skillDataList.push(selTargetSpell);

        //冷却事件
        if(cooldown!=null){
            const CDEoc:Eoc={
                type:"effect_on_condition",
                id:genEOCID(`${charName}_${spell.id}_Cooldown`),
                effect:[
                    {math:[cdValName,"-=","1"]}
                ],
                condition:{math:[cdValName,">=","0"]},
                eoc_type:"ACTIVATION",
            }
            dm.addCharEvent(charName,"CharUpdate",0,CDEoc);
            skillDataList.push(CDEoc);
        }
    }

    outData['skill'] = skillDataList;
}