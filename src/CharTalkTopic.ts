import { BoolObj, CNPC_FLAG, Eoc, genEOCID } from ".";
import { TalkTopic } from "./CddaJsonFormat/TalkTopic";
import { DataManager } from "./DataManager";








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
            condition:{npc_has_trait:defineData.baseMutID},
            text:"[升级]我想增强你的能力。",
            topic:defineData.talkTopicID,
            effect:{run_eocs:"CNPC_EOC_UseSoulDust"}
        },{
            condition:{npc_has_trait:defineData.baseMutID},
            text:"[继续]走吧。",
            topic:"TALK_DONE"
        }]
    }

    //更新等级的EocID
    const UpdateLvlEocID = genEOCID(`${charName}_UpdateLevel`);
    /**根据使用灵魂之尘数量提高经验 */
    const charUseSoulDust:Eoc={
        type:"effect_on_condition",
        id:genEOCID(`${charName}_AddSoulDustExp`),
        eoc_type:"ACTIVATION",
        effect:[
            {math:[defineData.expVarID,"+=","useSoulDustCount*10"]},
            {u_message:`${charName} 使用了 <global_val:useSoulDustCount> 个灵魂之尘`},
            {run_eocs:[UpdateLvlEocID]},
        ]
    }
    /**刷新角色等级 */
    const charUpdateLevel:Eoc={
        type:"effect_on_condition",
        id:UpdateLvlEocID,
        eoc_type:"ACTIVATION",
        effect:[
            {math:[defineData.expVarID,"-=",`LvlExp(${defineData.levelVarID})`]},
            {math:[defineData.levelVarID,"+=","1"]},
            {u_message:`${charName} 达到了 <global_val:${defineData.levelVarID}> 级`},
            {run_eocs:[UpdateLvlEocID]},
        ],
        condition:{math:[defineData.expVarID,">=",`LvlExp(${defineData.levelVarID})`]}
    }
    dm.addReverseCharEvent(charName,"CharUseSoulDust",0,charUseSoulDust);
    outData['talk_topic'] = [extTalkTopic,mainTalkTopic,charUseSoulDust,charUpdateLevel];
}