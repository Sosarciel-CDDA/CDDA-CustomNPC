import { BoolObj, CNPC_FLAG, Eoc, genEOCID } from ".";
import { Resp, TalkTopic } from "./CddaJsonFormat/TalkTopic";
import { DataManager } from "./DataManager";




/**获取强化字段的变量ID */
export function getFieldVarID(charName:string,field:string){
    return `${charName}_${field}`;
}


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
    //遍历升级项
    for(const upgObj of charConfig.upgrade||[]){
        const fieldID = getFieldVarID(charName,upgObj.field);
        //遍历升级项等级
        const maxLvl = upgObj.max_lvl||upgObj.require_resource.length;
        for(let lvl=0;lvl<maxLvl;lvl++){
            //获取当前等级材料 [ID, number][]
            const rawresource = lvl>upgObj.require_resource.length
                ? upgObj.require_resource[upgObj.require_resource.length-1]
                : upgObj.require_resource[lvl];
            const resource = rawresource.map(item=>{
                if(!Array.isArray(item))
                    return [item,1] as const;
                return item;
            })

            //条件
            const cond:BoolObj={and:[
                {math:[fieldID,"==",lvl+""]},
                ...resource.map(item=>({u_has_items:{
                    item: item[0],
                    count: item[1]
                }}))
            ]}
            const upgEocId = genEOCID(`${fieldID}_UpgradeEoc`);
            /**使用材料 */
            const charUpEoc:Eoc={
                type:"effect_on_condition",
                id:upgEocId,
                eoc_type:"ACTIVATION",
                effect:[
                    ...resource.map(item=>({
                        u_consume_item:item[0],
                        count: item[1],
                        popup:true
                    })),
                    {math:[fieldID,"+=","1"]},
                    {u_message:`${charName} 升级了 ${upgObj.field}`},
                ],
                condition:cond
            }
            upgEocList.push(charUpEoc);

            /**对话 */
            const resptext = `${upgObj.field} 消耗:${resource.map(item=>`<item_name:${item[0]}>:${item[1]} `).join("")}`;
            const charUpResp:Resp={
                condition:{math:[fieldID,"==",lvl+""]},
                truefalsetext:{
                    true:`[可以升级]${resptext}`,
                    false:`<color_red>[素材不足]${resptext}</color>`,
                    condition:cond,
                },
                topic:defineData.talkTopicID,
                effect:{run_eocs:upgEocId}
            }
            upgRespList.push(charUpResp);
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
    outData['talk_topic'] = [extTalkTopic,mainTalkTopic,...upgEocList];
}