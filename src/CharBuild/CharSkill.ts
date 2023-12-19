import { JArray, JObject, JToken, UtilFunc } from "@zwa73/utils";
import { genActEoc, genEOCID, genSpellID } from "ModDefine";
import { Spell, SpellEnergySource, SpellID ,AnyItemID, FlagID, BoolObj, Eoc, EocEffect, EocID, NumMathExp, NumObj, NoParamTalkerCondList, WeaponCategoryID, EffectID, Time, ParamsEoc, InlineEoc, SpellFlag, DamageTypeID, Resp, CondObj, SoundEffectID, SoundEffectVariantID} from "cdda-schema";
import { DataManager } from "../DataManager";
import { CON_SPELL_FLAG, SPELL_CT_MODMOVE, SPELL_CT_MODMOVE_VAR, SPELL_M1T, SPELL_MAX_DAMAGE,TARGET_MON_ID } from "StaticData";
import { CCharHookList, CCharHook, CInteractHookList } from "CnpcEvent";
import { SpecEffect, SpecProcMap, SpecSkillCastData } from "./CharSkillSpecEffect";


/**技能选择目标类型 列表 */
const TargetTypeList = [
    "auto"          ,//自动         任意非翻转hook
    "random"        ,//原版随机     任意非翻转hook
    "direct_hit"    ,//直接命中交互单位 u为角色 n为受害者 hook必须为InteractiveCharEvent
    "filter_random" ,//筛选目标随机 u为角色 n为受害者 处理时翻转 任意非翻转hook
    "control_cast"  ,//玩家控制施法
]as const;
/**技能选择目标类型  
 * auto 为 根据施法目标自动选择;  
 *  
 * random 为 原版随机 适用于自身buff;  
 *  
 * direct_hit 为 直接命中交互单位 适用于任何目标技能  
 * hook 必须为互动事件 "CharTakeDamage" | "CharTakeRangeDamage" | "CharTakeMeleeDamage" | "CharSucessMeleeAttack" | "CharCauseRangeHit" | "CharCauseHit";  
 *  
 * filter_random 为根据条件筛选可能的目标 命中第一个通过筛选的目标 条件中u为施法者n为目标 适用于队友buff;  
 *  
 * control_cast 为玩家控制施法 u 为玩家 n 为npc hook字段无效 `${spell.id}_loc` 为玩家选择坐标
 *  
 * 默认为auto  
 * 若允许多个CastCondition 请指定具体type  
 * 相同的hook与target(包括auto或未指定)将覆盖  
 */
type TargetType = typeof TargetTypeList[number];
/**角色技能 */
export type CharSkill = {
    /**技能名 */
    name:string;
    /**技能的释放条件 */
    cast_condition:CastCondition|CastCondition[];
    /**权重 优先尝试触发高权重的spell 默认0 */
    weight?         :number;
    /**概率 有1/chance的几率使用这个技能 默认1 */
    one_in_chance?  :number;
    /**冷却时间 单位为每次CharUpdate 默认0 */
    cooldown?       :number;
    /**共同冷却时间 影响所有技能的释放 单位为每次CharUpdate 默认1  
     * 一个高权重0共同冷却的技能意味着可以同时触发  
     */
    common_cooldown?:number;
    /**法术效果  
     * 可用 `u_${字段}` 或 `${角色名}_${字段}` 表示 当前/某个角色 的字段变量  
     * 如 min_damage: {math:["u_重击 * 10 + Asuna_重击"]}  
     *   
     * 可用 `u_${法术id}_cooldown` 获得对应技能冷却  
     * 如 {math:["u_fireball_cooldown"]}  
     *   
     * 可用 u_coCooldown 获得公共冷却时间  
     */
    spell           :Spell;
    /**子法术  
     * 将会随主spell一起解析  
     * 作为spell的extra_effects加入  
     */
    extra_effect?  :Spell[];
    /**特殊的子效果 */
    spec_effect?   :SpecEffect[];
    /**技能音效 */
    audio?          :(string|{
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
    })[];
    /**要求强化字段 [字段,强化等级] 或 字段名 */
    require_field?:[string,number]|string;
    /**释放成功后运行的效果 */
    after_effect?:EocEffect[];
    /**尝试释放时就运行的效果 */
    before_effect?:EocEffect[];
    /**需求的武器flag  
     * 在角色配置中定义的 武器 会自动生成并添加同ID Flag  
     */
    require_weapon_flag?:FlagID[];
    /**需求的武器分类 */
    require_weapon_category?:WeaponCategoryID[];
    /**需求无武器/完全徒手 */
    require_unarmed?:boolean;
};

/**技能的释放条件 */
export type CastCondition={
    /**释放条件 若允许多个条件请使用{or:[]}  
     * 相同的hook与target将覆盖  
     */
    condition?      : (BoolObj);
    /**时机 */
    hook            :CCharHook;
    /**瞄准方式  
     * auto 为 根据施法目标自动选择;  
     *  
     * random 为 原版随机 适用于自身buff;  
     *  
     * direct_hit 为 直接命中交互单位 适用于任何目标技能  
     * hook 必须为互动事件 "CharTakeDamage" | "CharTakeRangeDamage" | "CharTakeMeleeDamage" | "CharSucessMeleeAttack" | "CharCauseRangeHit" | "CharCauseHit";  
     *  
     * filter_random 为根据条件筛选可能的目标 命中第一个通过筛选的目标 条件中u为施法者n为目标 适用于队友buff;  
     *  
     * control_cast 为玩家控制施法 u 为玩家 n 为npc hook字段无效 `${spell.id}_loc` 为玩家选择坐标
     *   
     * 默认为auto  
     * 若允许多个CastCondition 请指定具体type  
     * 相同的hook与target(包括auto或未指定)将覆盖  
     */
    target?         :TargetType;
}

//全局冷却字段名
const gcdValName = `u_coCooldown`;

/**使某个技能停止使用的全局变量 */
export function getGlobalDisableSpellVar(charName:string,spell:Spell){
    return `${charName}_${spell.id}_disable`;
}
/**使某个技能停止使用的变量 */
export function getDisableSpellVar(talker:"u"|"n",spell:Spell){
    return `${talker}_${spell.id}_disable`;
}
/**解析音频id */
function parseAudioString(charName:string,str:string,volume:number=100){
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

//法术消耗变量类型映射
const costMap:Record<SpellEnergySource,string|undefined>={
    "BIONIC" : "u_val('power')",
    "HP"     : "u_hp('torso')",
    "MANA"   : "u_val('mana')",
    "STAMINA": "u_val('stamina')",
    "NONE"   : undefined,
}

/**处理角色技能 */
export async function createCharSkill(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);
    const skills = (charConfig.skill??[]).sort((a,b)=>(b.weight??0)-(a.weight??0));
    const skillDataList:JObject[] = [];

    //全局冷却事件
    const GCDEoc=genActEoc(`${charName}_CoCooldown`,
        [{math:[gcdValName,"-=","1"]}],
        {math:[gcdValName,">","0"]});
    dm.addCharEvent(charName,"Update",0,GCDEoc);
    skillDataList.push(GCDEoc);


    //遍历技能
    for(const skill of skills){
        //替换变量字段
        //skill.spell = JSON.parse(JSON.stringify(skill.spell)
        //    .replace(/(\{\{.*?\}\})/g,(match,p1)=>getFieldVarID(p1)));

        const {cast_condition,spell,extra_effect,cooldown,common_cooldown,audio,require_field,after_effect,before_effect,require_weapon_flag,require_weapon_category,require_unarmed,spec_effect} = skill;

        //法术消耗字符串
        const spellCost = `min(${spell.base_energy_cost??0}+${spell.energy_increment??0}*`+
            `u_val('spell_level', 'spell: ${spell.id}'),${spell.final_energy_cost??999999})`;
        //法术消耗变量类型
        const costType = spell.energy_source !== undefined
            ? costMap[spell.energy_source]
            : undefined;

        //修正子法术
        const extraEffects = extra_effect??[];

        //生成冷却变量名
        const cdValName = `u_${spell.id}_cooldown`;

        //计算成功效果
        const TEffect:EocEffect[]=[];
        if(common_cooldown!=0)
            TEffect.push({math:[gcdValName,"=",`${common_cooldown??1}`]});
        if(spell.base_energy_cost!=undefined && costType!=undefined)
            TEffect.push({math:[costType,"-=",spellCost]});
        if(cooldown)
            TEffect.push({math:[cdValName,"=",`${cooldown??0}`]});
        if(audio){
            TEffect.push(...audio.map(audioObj=>{
                if(typeof audioObj == "string")
                    return parseAudioString(charName,audioObj);
                //冷却变量ID
                const cdid = `audio_${audioObj.id}_cooldown`;
                if(audioObj.cooldown){
                    //冷却
                    const cdeoc=genActEoc(cdid,[{math:[cdid,"-=","1"]}],{math:[cdid,">","0"]});
                    dm.addCharEvent(charName,"BattleUpdate",0,cdeoc);
                    skillDataList.push(cdeoc);
                    //初始化
                    const initeoc=genActEoc(cdid+"_init",[{math:[cdid,"=","0"]}]);
                    dm.addCharEvent(charName,"EnterBattle",0,initeoc);
                    skillDataList.push(initeoc);
                }
                const effect:EocEffect = {
                    run_eocs:{
                        id:genEOCID(`${charName}_${audioObj.id}_Chance`),
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
            }));
        }
        if(after_effect)
            TEffect.push(...after_effect);
        //施法后暂停施法时间
        if(spell.base_casting_time){
            const ct = parseSpellNumObj(spell,"base_casting_time");
            TEffect.push(
                {math:[SPELL_CT_MODMOVE_VAR,"=",ct]},
                {u_cast_spell:{id:SPELL_CT_MODMOVE,hit_self:true}}
            );
        }

        //计算准备效果
        const PreEffect:EocEffect[] = [];
        if(before_effect)
            PreEffect.push(...before_effect)

        //遍历释放条件
        const ccs = Array.isArray(cast_condition)
            ?cast_condition
            :[cast_condition] as const;


        //生成子效果 并加入子法术 extraEffects
        const specDat:SpecSkillCastData = {
            skill, TEffect, PreEffect, extraEffects,
        }
        let specindex = 0;
        for(const spec of spec_effect??[])
            SpecProcMap[spec.type](dm,charName,specDat,spec,specindex++);
        //加入子效果
        if(extraEffects.length>0){
            spell.extra_effects=spell.extra_effects??[];
            spell.extra_effects.push(...extraEffects.map(spell=>({id:spell.id})))
        }

        //遍历释放条件生成施法eoc
        for(const castCondition of ccs){
            const {target} = castCondition;
            //计算基础条件 确保第一个为技能开关, 用于cast_control读取
            const baseCond: (BoolObj)[] = [
                {math:[getDisableSpellVar("u",spell),"!=","1"]},
                {math:[gcdValName,"<=","0"]},
            ];
            if(spell.base_energy_cost!=undefined && costType!=undefined)
                baseCond.push({math:[costType,">=",spellCost]});
            if(cooldown)
                baseCond.push({math:[cdValName,"<=","0"]});
            if(require_field){
                let fdarr = typeof require_field == "string"
                    ? [require_field,1] as const : require_field;
                baseCond.push({math:[`u_${fdarr[0]}`,">=",fdarr[1]+""]});
            }
            //对所有武器要求进行 或 处理
            const requireWeaponCond: (BoolObj)[] = [];
            if(require_weapon_flag)
                requireWeaponCond.push(...require_weapon_flag.map(id=>
                    ({u_has_wielded_with_flag:id})));
            if(require_weapon_category)
                requireWeaponCond.push(...require_weapon_category.map(id=>
                    ({u_has_wielded_with_weapon_category:id})));
            if(require_unarmed)
                requireWeaponCond.push({not:"u_has_weapon"});
            if(requireWeaponCond.length>0)
                baseCond.push({or:requireWeaponCond})

            //处理并加入输出
            const dat:BaseSkillCastData = {
                skill, TEffect, PreEffect,
                baseCond, castCondition, extraEffects,
            }
            //生成法术
            skillDataList.push(...(await ProcMap[target??"auto"](dm,charName,dat)));
        }
        dm.addSharedRes(spell.id,spell,"common_resource","common_spell");
        for(const exspell of extraEffects)
            dm.addSharedRes(exspell.id,exspell,"common_resource","common_spell");
        //冷却事件
        if(cooldown!=null){
            const CDEoc=genActEoc(`${charName}_${spell.id}_cooldown`,
                [{math:[cdValName,"-=","1"]}],
                {math:[cdValName,">","0"]})
            dm.addCharEvent(charName,"Update",0,CDEoc);
            skillDataList.push(CDEoc);
        }
    }

    outData['skill'] = skillDataList;
}

/**处理方式表 */
const ProcMap:Record<TargetType,(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData)=>Promise<JObject[]>>={
    "auto"          : autoProc,
    "random"        : randomProc,
    "direct_hit"    : direct_hitProc,
    "filter_random" : filter_randomProc,
    "control_cast"  : control_castProc,
}

/**基础技能数据 */
type BaseSkillCastData=Readonly<{
    /**技能 */
    skill:CharSkill;
    /**基础释放eoc条件 */
    baseCond: (BoolObj)[];
    /**基础成功eoc效果 */
    TEffect:EocEffect[];
    /**基础准备释放Eoc */
    PreEffect:EocEffect[];
    /**释放条件 */
    castCondition:CastCondition;
    /**子法术 */
    extraEffects:Spell[];
}>


//获取施法方式的uid
function castCondUid(cc:CastCondition){
    return `${cc.hook}_${cc.target??"auto"}`;
}
//翻转u与n
function revTalker(obj:JToken):any{
    let str = JSON.stringify(obj);
    str = str.replace(/"u_(\w+?)":/g, '"tmpnpctmp_$1":');
    str = str.replace(/(?<!\w)u_/g, 'tmpntmp_');

    str = str.replace(/"npc_(\w+?)":/g, '"u_$1":');
    str = str.replace(/(?<!\w)n_/g, 'u_');

    str = str.replace(/tmpnpctmp_/g, 'npc_');
    str = str.replace(/tmpntmp_/g, 'n_');

    //修正无参条件
    const npcond = NoParamTalkerCondList.join('|');
    const regex = new RegExp(`"n_(${npcond})"`,'g');
    str = str.replace(regex,`"npc_$1"`);
    return JSON.parse(str);
}
/**解析NumObj为math表达式 */
export function parseNumObj(value:any){
    let strExp = `0`;
    if(value!==undefined){
        if(typeof value == "number")
            strExp = value+"";
        else if(typeof value == "object" && "math" in value)
            strExp = value.math[0];
        else throw `伤害解析只支持固定值number 或 math表达式`
    }
    return strExp;
}
/**解析法术伤害字符串 */
function parseSpellNumObj(spell:Spell,field:keyof Spell){
    return parseNumObj(spell[field]);
}

function genCastEocID(charName:string,spell:Spell,ccuid:string):EocID{
    return genEOCID(`${charName}_Cast${spell.id}_${ccuid}`);
}
function genTrueEocID(charName:string,spell:Spell,ccuid:string):EocID{
    return genEOCID(`${charName}_${spell.id}TrueEoc_${ccuid}`)
}


async function randomProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    const {skill,baseCond,TEffect,castCondition,PreEffect,extraEffects} = baseSkillData;
    const {spell,one_in_chance} = skill;
    const {hook} = castCondition;
    if(castCondition.condition) baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);

    //创建施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genCastEocID(charName,spell,ccuid),
        eoc_type:"ACTIVATION",
        effect:[
            ...PreEffect,
            {
                u_cast_spell:{
                    id:spell.id,
                    once_in:one_in_chance,
                },
                targeted: false,
                true_eocs:{
                    id:genTrueEocID(charName,spell,ccuid),
                    effect:[...TEffect],
                    eoc_type:"ACTIVATION",
                }
            }
        ],
        condition:{and:[...baseCond]},
    }

    dm.addCharEvent(charName,hook as CCharHook,0,castEoc);

    return [castEoc];
}

async function filter_randomProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    let {skill,baseCond,TEffect,castCondition,PreEffect,extraEffects} = baseSkillData;
    const {spell,one_in_chance} = skill;
    const {hook} = castCondition;
    const ccuid = castCondUid(castCondition);

    //设置翻转条件
    const filterCond: (BoolObj) = revTalker(castCondition.condition);

    //命中id
    const fhitvar = `${spell.id}_hasTarget`;

    //创建施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genCastEocID(charName,spell,ccuid),
        eoc_type:"ACTIVATION",
        effect:[
            ...PreEffect,
            {
                u_cast_spell:{
                    id:spell.id,
                    once_in:one_in_chance,
                },
                true_eocs:{
                    id:genTrueEocID(charName,spell,ccuid),
                    effect:[...TEffect],
                    eoc_type:"ACTIVATION",
                },
                loc:{global_val:"tmp_loc"}
            }
        ],
        condition:{math:[fhitvar,"!=","0"]},
    }

    //创建记录坐标Eoc
    const locEoc:Eoc={
        id:genEOCID(`${spell.id}_RecordLoc`),
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        effect:[
            {math:[fhitvar,"=","1"]},
            {npc_location_variable: { global_val: "tmp_loc" }},
        ],
        condition:{and:[
            filterCond,
            {math:[fhitvar,"!=","1"]},
        ]}
    }
    dm.addSharedRes(locEoc.id,locEoc,"common_resource","common_spell");


    //创建筛选目标的辅助索敌法术
    const flags:SpellFlag[] = [...CON_SPELL_FLAG];
    if(spell.flags?.includes("IGNORE_WALLS"))
        flags.push("IGNORE_WALLS")
    const {min_range,max_range,range_increment,
        max_level,valid_targets,targeted_monster_ids} = spell;
    const filterTargetSpell:Spell = {
        id:genSpellID(`${charName}_${spell.id}_FilterTarget_${ccuid}`),
        type:"SPELL",
        name:spell.name+"_筛选索敌",
        description:`${spell.name}的筛选索敌法术`,
        effect:"effect_on_condition",
        effect_str:locEoc.id,
        flags,
        shape:"blast",
        min_aoe:min_range,
        max_aoe:max_range,
        aoe_increment:range_increment,
        max_level,targeted_monster_ids,
        valid_targets:valid_targets.filter(item=>item!="ground"),
    }

    //创建释放索敌法术的eoc
    const castSelEoc:Eoc = {
        type:"effect_on_condition",
        id:genEOCID(`Cast${filterTargetSpell.id}`),
        eoc_type:"ACTIVATION",
        effect:[
            {u_cast_spell:{id:filterTargetSpell.id,once_in:one_in_chance,}},
            {run_eocs:castEoc.id},
            {math:[fhitvar,"=","0"]}
        ],
        condition:{and:[...baseCond]},
    }

    dm.addCharEvent(charName,hook as CCharHook,0,castSelEoc);

    return [castEoc,castSelEoc,filterTargetSpell];
}

async function direct_hitProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    const {skill,baseCond,TEffect,castCondition,PreEffect,extraEffects} = baseSkillData;
    const {spell,one_in_chance} = skill;
    const {hook} = castCondition;
    if(castCondition.condition) baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);

    //创建施法EOC
    const castEoc:Eoc={
        type:"effect_on_condition",
        id:genCastEocID(charName,spell,ccuid),
        eoc_type:"ACTIVATION",
        effect:[
            ...PreEffect,
            {npc_location_variable: { global_val: "tmp_loc" }},
            {
                u_cast_spell:{
                    id:spell.id,
                    once_in:one_in_chance
                },
                true_eocs:{
                    id:genTrueEocID(charName,spell,ccuid),
                    effect:[...TEffect],
                    eoc_type:"ACTIVATION",
                },
                loc:{ global_val: "tmp_loc" }
            }
        ],
        condition:{and:[...baseCond]},
    }

    //加入触发
    if(!CInteractHookList.includes(hook as any))
        throw `直接命中 所用的事件必须为 交互事件: ${CInteractHookList}`
    dm.addCharEvent(charName,hook as CCharHook,0,castEoc);

    return [castEoc];
}

async function autoProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    const {skill,castCondition} = baseSkillData;
    const {spell} = skill;
    const {hook} = castCondition;
    //判断瞄准方式
    //是敌对目标法术
    const isHostileTarget = spell.valid_targets.includes("hostile");
    const isAllyTarget    = spell.valid_targets.includes("ally");

    //有释放范围
    const hasRange = (spell.min_range!=null && spell.min_range!=0) ||
        (spell.range_increment!=null && spell.range_increment!=0);

    //有范围 有条件 友方目标 法术适用筛选命中
    if(isAllyTarget && hasRange && castCondition.condition!=undefined)
        return ProcMap.filter_random(dm,charName,baseSkillData);

    //hook为互动事件 敌对目标 法术将直接命中
    if((CInteractHookList.includes(hook as any)) && isHostileTarget)
        return ProcMap.direct_hit(dm,charName,baseSkillData);

    //其他法术随机
    return ProcMap.random(dm,charName,baseSkillData);
}

async function control_castProc(dm:DataManager,charName:string,baseSkillData:BaseSkillCastData){
    const {skill,castCondition,extraEffects} = baseSkillData;
    let {baseCond,TEffect,PreEffect} = baseSkillData;
    const {name,spell,one_in_chance} = skill;
    const {hook} = castCondition;
    //删除开关条件
    baseCond.shift();
    if(castCondition.condition) baseCond.push(castCondition.condition);
    const ccuid = castCondUid(castCondition);

    //翻转对话者 将u改为n使其适用npc
    baseCond = revTalker(baseCond);
    TEffect = revTalker(TEffect);
    PreEffect = revTalker(PreEffect);

    //将字段要求作为显示条件
    const hideCond: (BoolObj)[] = [];
    const {require_field} = skill;
    if(require_field){
        let fdarr = typeof require_field == "string"
            ? [require_field,1] as const : require_field;
        hideCond.push({math:[`u_${fdarr[0]}`,">=",fdarr[1]+""]});
    }

    const playerSelectLoc = { global_val:`${spell.id}_loc`};

    const coneocid = genCastEocID(charName,spell,ccuid);
    //创建选择施法eoc
    const controlEoc:Eoc={
        type:"effect_on_condition",
        id:coneocid,
        eoc_type:"ACTIVATION",
        effect:[
            {u_cast_spell:{id:SPELL_M1T, hit_self:true}},
            {npc_location_variable:{global_val:"tmp_casterloc"}},
            {queue_eocs:{
                id:(coneocid+"_queue") as EocID,
                eoc_type:"ACTIVATION",
                effect:[{run_eoc_with:{
                    id: (coneocid+"_queue_with") as EocID,
                    eoc_type:"ACTIVATION",
                    effect:[{
                        if:{u_query_tile:"line_of_sight",target_var:playerSelectLoc,range:30},
                        then:[
                            ...PreEffect,{
                            npc_cast_spell:{id:spell.id},
                            targeted: false,
                            true_eocs:{
                                id:genTrueEocID(charName,spell,ccuid),
                                effect:[...TEffect],
                                eoc_type:"ACTIVATION",
                            },
                            loc:playerSelectLoc
                        }]
                    }]
                },beta_loc:{global_val:"tmp_casterloc"}}]
            },time_in_future:0},
        ],
        false_effect:[],
        condition:{and:[...baseCond]}
    }

    const sourceNameMap = {
        "MANA"      : "魔力"    ,
        "BIONIC"    : "生化能量",
        "HP"        : "生命值"  ,
        "STAMINA"   : "耐力"    ,
    }
    const source:string = (sourceNameMap as any)[spell.energy_source as any]??"";
    const coststr = spell.base_energy_cost==0 || spell.base_energy_cost==undefined
        ? ""
        : `耗能:${spell.base_energy_cost}${source}`;
    //创建施法对话
    const castResp:Resp={
        condition:{and:hideCond},
        truefalsetext:{
            condition:{and:[...baseCond]},
            true:`[可释放] ${name} ${coststr}`,
            false:`[不可释放] ${name} ${coststr} 冷却中:<npc_val:${spell.id}_cooldown>`,
        },
        effect:{run_eocs:controlEoc.id},
        topic:"TALK_DONE",
    }

    const {defineData,outData,charConfig} = await dm.getCharData(charName);
    defineData.castResp.push(castResp);
    return [controlEoc];
}