import { JObject } from "@zwa73/utils";
import { AnyItemID, BoolObj, CNPC_FLAG, Eoc, Flag, ItemGroup, genEOCID, genFlagID, genTalkTopicID } from ".";
import { DynamicLine, Resp, TalkTopic } from "./CddaJsonFormat/TalkTopic";
import { RequireResource, getGlobalFieldVarID, getTalkerFieldVarID } from "./CharConfig";
import { getGlobalStopSpellVar, getStopSpellVar } from "./CharSkill";
import { DataManager } from "./DataManager";






/**创建对话选项 */
export async function createCharTalkTopic(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);

    //扩展对话
    const extTalkTopic:TalkTopic={
        type:"talk_topic",
        id:["TALK_FRIEND","TALK_FRIEND_GUARD"],
        responses:[{
            condition:{npc_has_trait:defineData.baseMutID},
            text:"[CNPC]我想聊聊关于你的事。",
            topic:defineData.talkTopicID
        }]
    }


    /**主对话 */
    const mainTalkTopic:TalkTopic={
        type:"talk_topic",
        id:defineData.talkTopicID,
        dynamic_line:"...",
        responses:[{
            text : "[强化]我想提升你的能力。",
            topic: await createUpgResp(dm,charName)
        },
        {
            text : "[技能]我想调整你的技能。",
            topic: await createSkillResp(dm,charName)
        },
        {
            text : "[返回]算了。",
            topic: "TALK_NONE"
        }]
    }


    outData['talk_topic'] = [extTalkTopic,mainTalkTopic];
}


/**创建升级对话 */
async function createUpgResp(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);

    //主升级话题ID
    const upgtopicid = genTalkTopicID(`${charName}_upgrade`);

    //显示素材不足开关变量ID
    const showNotEnough = `${charName}_showNotEnoughRes`;

    //初始化变量Eoc
    const InitUpgField:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_InitFieldVar`),
        eoc_type:"ACTIVATION",
        effect:[]
    }

    /**升级项列表 */
    const upgRespList:Resp[] = [];
    const upgTopicList:TalkTopic[] = [];
    const upgEocList:Eoc[] = [];
    //遍历升级项
    for(const upgObj of charConfig.upgrade??[]){
        //子话题的回复
        const upgSubRespList:Resp[] = [];
        //判断是否有任何子选项可以升级
        const upgSubResCondList:BoolObj[] = [];
        //全局字段变量
        const globalFieldID = getGlobalFieldVarID(charName,upgObj.field);

        //字段
        const field = upgObj.field;
        const ufield = getTalkerFieldVarID("u",field);
        const nfield = getTalkerFieldVarID("n",field);
        //子话题ID
        const subTopicId = genTalkTopicID(globalFieldID);

        //遍历升级项等级
        const maxLvl = upgObj.max_lvl??upgObj.require_resource.length;
        for(let lvl=0;lvl<maxLvl;lvl++){
            //确认是否为最后一个定义材料
            const isLastRes = lvl>=upgObj.require_resource.length-1;
            //获取当前等级的 或材料组
            const orRes = isLastRes
                ? upgObj.require_resource[upgObj.require_resource.length-1]
                : upgObj.require_resource[lvl];

            //遍历 或材料组 取得 与材料组
            let index = 0;
            for(const andRes of orRes){
                //过滤item 全部转为obj形式
                const fixRes:RequireResource[] = andRes.map(item=>typeof item =="string" ? {id:item} : item);
                //字段等级条件
                const lvlCond:BoolObj[] = (isLastRes
                        ? [{math:[nfield,">=",lvl+""]},{math:[nfield,"<",maxLvl+""]}]
                        : [{math:[nfield,"==",lvl+""]}])
                //升级材料条件
                const cond:BoolObj={and:[
                    ...lvlCond,
                    ...fixRes.map(item=>({u_has_items:{
                        item: item.id,
                        count: item.count??1
                    }}))
                ]}
                upgSubResCondList.push(cond)
                //升级EocId
                const upgEocId = genEOCID(`${globalFieldID}_UpgradeEoc_${index}`);
                /**使用材料 */
                const charUpEoc:Eoc={
                    type:"effect_on_condition",
                    id:upgEocId,
                    eoc_type:"ACTIVATION",
                    effect:[
                        ...fixRes.filter(item=>item.not_consume!==true)
                            .map(item=>({
                                u_consume_item:item.id,
                                count: item.count??1,
                                popup:true
                            })),
                        {math:[globalFieldID,"+=","1"]},
                        {math:[nfield,"=",globalFieldID]},
                        {u_message:`${charName} 升级了 ${upgObj.field}`},
                        ...upgObj.effect??[],//应用升级效果
                    ],
                    condition:cond
                }
                upgEocList.push(charUpEoc);

                /**对话 */
                const costtext = fixRes.map(item=>`<item_name:${item.id}>:${item.count??1} `).join("");
                const resptext = `消耗:${costtext}\n`;
                const charUpResp:Resp={
                    condition:{and:lvlCond},
                    truefalsetext:{
                        true:`[可以升级]${resptext}`,
                        false:`<color_red>[素材不足]${resptext}</color>`,
                        condition:cond,
                    },
                    topic:subTopicId,
                    effect:{run_eocs:upgEocId}
                }
                upgSubRespList.push(charUpResp);
                index++;
            }

            if(isLastRes) break;
        }

        //遍历强化变异表
        for(const mutOpt of upgObj.mutation??[]){
            const mut = typeof mutOpt=="string"
                ? {id:mutOpt,lvl:1} as const
                : mutOpt;

            //创建变异EOC
            const mutEoc:Eoc = {
                type:"effect_on_condition",
                id:genEOCID(`${field}_${mut.id}_${mut.lvl}`),
                eoc_type:"ACTIVATION",
                effect:[
                    {u_add_trait:mut.id}
                ],
                condition:{and:[
                    {not:{u_has_trait:mut.id}},
                    {math:[ufield,">=",mut.lvl+""]}
                ]}
            }

            dm.addCharEvent(charName,"CharUpdate",0,mutEoc);
            dm.addSharedRes("field_mut_eoc",mutEoc.id,mutEoc);
        }

        //创建对应升级菜单路由选项
        const resptext = `${upgObj.field} 当前等级:<npc_val:${upgObj.field}>`;
        upgRespList.push({
            truefalsetext:{
                true:`[可以升级]${resptext}`,
                false:`<color_red>[素材不足]${resptext}</color>`,
                condition:{or:upgSubResCondList},
            },
            topic:subTopicId,
            condition:{and:[
                {or:[{or:upgSubResCondList},{math:[showNotEnough,"==","1"]}]},
                {math:[nfield,"<",maxLvl+""]}
            ]}
        });
        //创建满级选项
        upgRespList.push({
            text:`<color_red>[达到上限]${resptext}</color>`,
            topic:subTopicId,
            condition:{and:[
                {or:[{or:upgSubResCondList},{math:[showNotEnough,"==","1"]}]},
                {math:[nfield,">=",maxLvl+""]}
            ]}
        });
        //创建菜单话题
        const desc = upgObj.desc ? "\n"+upgObj.desc : "";
        upgTopicList.push({
            type:"talk_topic",
            id:subTopicId,
            dynamic_line:`&${resptext}${desc}`,
            responses:[...upgSubRespList,{
                text:"[返回]算了。",
                topic:upgtopicid
            }]
        })

        //添加初始化
        InitUpgField.effect?.push({math:[globalFieldID,"=",`${globalFieldID}<=0 ? 0 : ${globalFieldID}`]});
        InitUpgField.effect?.push({math:[ufield,"=",`${globalFieldID}`]});
    }
    //升级主对话
    const upgTalkTopic:TalkTopic={
        type:"talk_topic",
        id:upgtopicid,
        dynamic_line:"&",
        responses:[...upgRespList,
        {
            truefalsetext:{
                condition:{math:[showNotEnough,"==","1"]},
                true:"[显示切换]隐藏素材不足项",
                false:"[显示切换]显示素材不足项"
            },
            topic:upgtopicid,
            effect:{math:[`${showNotEnough}`,"=",`(${showNotEnough} == 1) ? 0 : 1`]}
        },
        {
            text:"[继续]走吧。",
            topic:"TALK_DONE"
        }]
    }
    //注册初始化eoc
    dm.addCharEvent(charName,"CharInit",0,InitUpgField);

    outData['upgrade_talk_topic'] = [InitUpgField,upgTalkTopic,...upgEocList,...upgTopicList];
    return upgtopicid;
}

/**创建技能对话 */
async function createSkillResp(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);
    //主对话id
    const skillTalkTopicId = genTalkTopicID(`${charName}_skill`);

    //初始化状态Eoc
    const InitSkill:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_InitSkill`),
        eoc_type:"ACTIVATION",
        effect:[]
    }

    //遍历技能
    const skillRespList:Resp[] = [];
    const skillRespEocList:Eoc[] = [];
    const dynLine:DynamicLine[] = [];
    for(const skill of charConfig.skill??[]){
        const {spell} = skill;
        const gstopVar = getGlobalStopSpellVar(charName,spell);
        const nstopVar = getStopSpellVar("n",spell);
        const ustopVar = getStopSpellVar("u",spell);

        const eocid = genEOCID(`${gstopVar}_switch`)
        const eoc:Eoc={
            type:"effect_on_condition",
            id:eocid,
            eoc_type:"ACTIVATION",
            effect:[
                {math:[gstopVar,"=","0"]},
                {math:[nstopVar,"=","0"]},
            ],
            false_effect:[
                {math:[gstopVar,"=","1"]},
                {math:[nstopVar,"=","1"]},
            ],
            condition:{math:[nstopVar,"==","1"]},
        }
        skillRespEocList.push(eoc)

        const resp:Resp={
            truefalsetext:{
                condition:{math:[nstopVar,"==","1"]},
                true:`[已停用] ${spell.name.replace(/(.+?)(_NPC|"")$/g,'$1')}`,
                false:`[已启用] ${spell.name.replace(/(.+?)(_NPC|"")$/g,'$1')}`,
            },
            effect:{run_eocs:eocid},
            topic:skillTalkTopicId,
        }
        if(skill.require_field){
            let fdarr = typeof skill.require_field == "string"
                ? [skill.require_field,1] as const : skill.require_field;
            resp.condition = {math:[getTalkerFieldVarID("n",fdarr[0]),">=",`${fdarr[1]}`]}
        }
        skillRespList.push(resp);

        dynLine.push({
            math:[nstopVar,"==","1"],
            yes:`${charName} 不会使用 ${spell.name.replace(/(.+?)(_NPC|"")$/g,'$1')}\n`,
            no:`${charName} 会尝试使用 ${spell.name.replace(/(.+?)(_NPC|"")$/g,'$1')}\n`,
        })

        //添加初始化
        InitSkill.effect?.push({math:[ustopVar,"=",`${gstopVar}`]});
    }

    //技能主对话
    const skillTalkTopic:TalkTopic={
        type:"talk_topic",
        id:skillTalkTopicId,
        dynamic_line:"&",
        //dynamic_line:{concatenate:["&",...dynLine]},
        responses:[...skillRespList,{
            text:"[继续]走吧。",
            topic:"TALK_DONE"
        }]
    }

    //注册初始化eoc
    dm.addCharEvent(charName,"CharInit",0,InitSkill);
    outData['skill_talk_topic'] = [skillTalkTopic,...skillRespEocList,InitSkill];
    return skillTalkTopicId;
}


/**创建武器对话 */
async function createWeaponResp(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);
    //透明物品ID
    const TransparentItem = "CNPC_GENERIC_TransparentItem";
    //主对话id
    const weaponTalkTopicId = genTalkTopicID(`${charName}_weapon`);

    /**基础武器 预处理 */
    const baseWeapons = charConfig.weapon;
    const baseWeaponData:JObject[] = [];
    if(baseWeapons){
        for(const baseWeapon of baseWeapons){
            baseWeapon.looks_like = baseWeapon.looks_like||TransparentItem;
            baseWeapon.flags = baseWeapon.flags||[];
            baseWeapon.flags?.push(
                "ACTIVATE_ON_PLACE"      ,//自动销毁
                "TRADER_KEEP"            ,//不会出售
                "UNBREAKABLE"            ,//不会损坏
            );
            if(baseWeapon.type=="GUN"){
                baseWeapon.flags?.push(
                    "NEEDS_NO_LUBE" ,//不需要润滑油
                    "NEVER_JAMS"    ,//不会故障
                    "NON_FOULING"   ,//枪不会变脏或被黑火药污染。
                )
            }
            baseWeapon.countdown_interval= 1; //自动销毁

            /**基础武器物品组 */
            const baseItemGroup:ItemGroup={
                type:"item_group",
                id:defineData.baseWeaponGroupID,
                subtype:"collection",
                items:[baseWeapon.id],
            }
            /**基础武器的识别flag */
            const baseWeaponFlag:Flag={
                type:"json_flag",
                id:genFlagID(baseWeapon.id),
            }
            /**如果没武器则给予 */
            const giveWeapon:Eoc={
                type:"effect_on_condition",
                eoc_type:"ACTIVATION",
                id:genEOCID(`${charName}_GiveWeapon`),
                condition:{not:{ u_has_item: baseWeapon.id }},
                effect:[
                    {u_spawn_item:baseWeapon.id}
                ]
            }
            dm.addCharEvent(charName,"CharUpdate",0,giveWeapon);

            /**丢掉其他武器 */
            const dropOtherWeapon:Eoc={
                type:"effect_on_condition",
                id:genEOCID(`${charName}_DropOtherWeapon`),
                condition:{and:[
                    "u_can_drop_weapon",
                    {not:{u_has_wielded_with_flag: baseWeaponFlag.id}}
                ]},
                effect:[
                    {u_location_variable:{global_val:"tmp_loc"}},
                    {run_eoc_with:{
                        id:genEOCID(`${charName}_DropOtherWeapon_Sub`),
                        eoc_type:"ACTIVATION",
                        effect:["drop_weapon"]
                    },beta_loc:{"global_val":"tmp_loc"}} //把自己设为betaloc防止报错
                ],
                eoc_type:"ACTIVATION",
            }
            dm.addCharEvent(charName,"CharUpdate",0,dropOtherWeapon);

            baseWeaponData.push(giveWeapon,baseWeaponFlag,baseItemGroup,baseWeapon);
        }
    }
}