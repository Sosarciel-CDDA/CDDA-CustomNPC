import { BoolObj, CNPC_FLAG, Eoc, genEOCID, genTalkTopicID } from ".";
import { Resp, TalkTopic } from "./CddaJsonFormat/TalkTopic";
import { getFieldVarID } from "./CharConfig";
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
            text : "[返回]算了。",
            topic: "TALK_NONE"
        }]
    }


    outData['talk_topic'] = [extTalkTopic,mainTalkTopic];
}



async function createUpgResp(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);

    //主升级话题ID
    const upgtopicid = genTalkTopicID(`${charName}_upgrade`);

    /**升级项列表 */
    const upgRespList:Resp[] = [];
    const upgTopicList:TalkTopic[] = [];
    const upgEocList:Eoc[] = [];
    const mutEocList:Eoc[] = [];
    //遍历升级项
    for(const upgObj of charConfig.upgrade??[]){
        //子话题的回复
        const upgSubRespList:Resp[] = [];
        //判断是否有任何子选项可以升级
        const upgSubResCondList:BoolObj[] = [];
        //字段变量ID
        const fieldID = getFieldVarID(charName,upgObj.field);
        //子话题ID
        const subTopicId = genTalkTopicID(fieldID);

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
                //字段等级条件
                const lvlCond:BoolObj[] = (isLastRes
                        ? [{math:[fieldID,">=",lvl+""]},{math:[fieldID,"<",maxLvl+""]}]
                        : [{math:[fieldID,"==",lvl+""]}])
                //升级材料条件
                const cond:BoolObj={and:[
                    ...lvlCond,
                    ...andRes.map(item=>({u_has_items:{
                        item: item.id,
                        count: item.count??1
                    }}))
                ]}
                upgSubResCondList.push(cond)
                //升级EocId
                const upgEocId = genEOCID(`${fieldID}_UpgradeEoc_${index}`);
                /**使用材料 */
                const charUpEoc:Eoc={
                    type:"effect_on_condition",
                    id:upgEocId,
                    eoc_type:"ACTIVATION",
                    effect:[
                        ...andRes.filter(item=>item.not_consume!==true)
                            .map(item=>({
                                u_consume_item:item.id,
                                count: item.count??1,
                                popup:true
                            })),
                        {math:[fieldID,"+=","1"]},
                        {u_message:`${charName} 升级了 ${upgObj.field}`},
                    ],
                    condition:cond
                }
                upgEocList.push(charUpEoc);

                /**对话 */
                const costtext = andRes.map(item=>`<item_name:${item.id}>:${item.count??1} `).join("");
                const resptext = `${upgObj.field} 当前等级:<global_val:${fieldID}>\n升级消耗:${costtext}\n`;
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
                id:genEOCID(`${fieldID}_${mut.id}_${mut.lvl}`),
                eoc_type:"ACTIVATION",
                effect:[
                    {u_add_trait:mut.id}
                ],
                condition:{and:[
                    {not:{u_has_trait:mut.id}},
                    {math:[fieldID,">=",mut.lvl+""]}
                ]}
            }

            dm.addCharEvent(charName,"CharUpdate",0,mutEoc);
            mutEocList.push(mutEoc);
        }

        //创建对应升级菜单
        upgTopicList.push({
            type:"talk_topic",
            id:subTopicId,
            dynamic_line:"...",
            responses:[...upgSubRespList,{
                text:"[返回]算了。",
                topic:upgtopicid
            }]
        })
        upgRespList.push({
            truefalsetext:{
                true:`[可以升级]${upgObj.field}`,
                false:`<color_red>[素材不足]${upgObj.field}</color>`,
                condition:{or:upgSubResCondList},
            },
            topic:subTopicId,
        });
    }

    const upgTalkTopic:TalkTopic={
        type:"talk_topic",
        id:upgtopicid,
        dynamic_line:"...",
        responses:[...upgRespList,{
            text:"[继续]走吧。",
            topic:"TALK_DONE"
        }]
    }
    outData['upgrade_talk_topic'] = [upgTalkTopic,...upgEocList,...mutEocList,...upgTopicList];
    return upgtopicid;
}