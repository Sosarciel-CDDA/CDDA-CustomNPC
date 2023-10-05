import { BoolObj, CNPC_FLAG, Eoc, genEOCID } from ".";
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



    /**升级项列表 */
    const upgRespList:Resp[] = [];
    const upgEocList:Eoc[] = [];
    const mutEocList:Eoc[] = [];
    //遍历升级项
    for(const upgObj of charConfig.upgrade??[]){
        const fieldID = getFieldVarID(charName,upgObj.field);
        //遍历升级项等级
        const maxLvl = upgObj.max_lvl??upgObj.require_resource.length;
        for(let lvl=0;lvl<maxLvl;lvl++){
            //确认是否为最后一个定义材料
            const isLastRes = lvl>=upgObj.require_resource.length
            //获取当前等级材料 [ID, number][]
            const resource = isLastRes
                ? upgObj.require_resource[upgObj.require_resource.length-1]
                : upgObj.require_resource[lvl];

            //字段等级条件
            const lvlCond:BoolObj[] = (isLastRes
                    ? [{math:[fieldID,">=",lvl+""]},{math:[fieldID,"<",maxLvl+""]}]
                    : [{math:[fieldID,"==",lvl+""]}])
            //升级材料条件
            const cond:BoolObj={and:[
                ...lvlCond,
                ...resource.map(item=>({u_has_items:{
                    item: item.id,
                    count: item.count??1
                }}))
            ]}
            //升级EocId
            const upgEocId = genEOCID(`${fieldID}_UpgradeEoc`);
            /**使用材料 */
            const charUpEoc:Eoc={
                type:"effect_on_condition",
                id:upgEocId,
                eoc_type:"ACTIVATION",
                effect:[
                    ...resource.filter(item=>item.not_consume!==true)
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
            const resptext = `${upgObj.field} 消耗:${resource.map(item=>`<item_name:${item.id}>:${item.count??1} `).join("")}`;
            const charUpResp:Resp={
                condition:{and:lvlCond},
                truefalsetext:{
                    true:`[可以升级]${resptext}`,
                    false:`<color_red>[素材不足]${resptext}</color>`,
                    condition:cond,
                },
                topic:defineData.talkTopicID,
                effect:{run_eocs:upgEocId}
            }
            upgRespList.push(charUpResp);

            if(isLastRes) break;
        }

        //遍历强化变异表
        for(const mutOpt of upgObj.mutation??[]){
            const mut = typeof mutOpt=="string"
                ? [mutOpt,1] as const
                : mutOpt;

            //创建变异EOC
            const mutEoc:Eoc = {
                type:"effect_on_condition",
                id:genEOCID(`${fieldID}_${mut[0]}_${mut[1]}`),
                eoc_type:"ACTIVATION",
                effect:[
                    {u_add_trait:mut[0]}
                ],
                condition:{and:[
                    {not:{u_has_trait:mut[0]}},
                    {math:[fieldID,">=",mut[1]+""]}
                ]}
            }

            dm.addCharEvent(charName,"CharUpdate",0,mutEoc);
            mutEocList.push(mutEoc);
        }
    }



    /**主对话 */
    const mainTalkTopic:TalkTopic={
        type:"talk_topic",
        id:defineData.talkTopicID,
        dynamic_line:"...",
        responses:[...upgRespList,{
            condition:{npc_has_trait:defineData.baseMutID},
            text:"[返回]算了。",
            topic:"TALK_NONE"
        }]
    }
    outData['talk_topic'] = [extTalkTopic,mainTalkTopic,...upgEocList,...mutEocList];
}