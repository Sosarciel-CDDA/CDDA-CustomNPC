"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharTalkTopic = void 0;
const _1 = require(".");
async function createCharTalkTopic(dm, charName) {
    const { defineData, outData, charConfig } = await dm.getCharData(charName);
    //扩展对话
    const extTalkTopic = {
        type: "talk_topic",
        id: ["TALK_FRIEND", "TALK_FRIEND_GUARD"],
        responses: [{
                condition: { npc_has_trait: defineData.baseMutID },
                text: "[CNPC]我想聊聊关于你的事。",
                topic: defineData.talkTopicID
            }]
    };
    /**主对话 */
    const mainTalkTopic = {
        type: "talk_topic",
        id: defineData.talkTopicID,
        dynamic_line: "...",
        responses: [{
                condition: { npc_has_trait: defineData.baseMutID },
                text: "[升级]我想增强你的能力。",
                topic: "TALK_DONE",
                effect: { run_eocs: "CNPC_EOC_UseSoulDust" }
            }]
    };
    //更新等级的EocID
    const UpdateLvlEocID = (0, _1.genEOCID)(`${charName}_UpdateLevel`);
    /**根据使用灵魂之尘数量提高经验 */
    const charUseSoulDust = {
        type: "effect_on_condition",
        id: (0, _1.genEOCID)(`${charName}_AddSoulDustExp`),
        eoc_type: "ACTIVATION",
        effect: [
            { math: [defineData.expVarID, "+=", "useSoulDustCount*10"] },
            { u_message: `${charName} 使用了 <global_val:useSoulDustCount> 个灵魂之尘` },
            { run_eocs: [UpdateLvlEocID] },
        ]
    };
    /**刷新角色等级 */
    const charUpdateLevel = {
        type: "effect_on_condition",
        id: UpdateLvlEocID,
        eoc_type: "ACTIVATION",
        effect: [
            { math: [defineData.expVarID, "-=", `LvlExp(${defineData.levelVarID})`] },
            { math: [defineData.levelVarID, "+=", "1"] },
            { u_message: `${charName} 达到了 <global_val:${defineData.levelVarID}> 级` },
            { run_eocs: [UpdateLvlEocID] },
        ],
        condition: { math: [defineData.expVarID, ">=", `LvlExp(${defineData.levelVarID})`] }
    };
    dm.addReverseCharEvent(charName, "CharUseSoulDust", 0, charUseSoulDust);
    outData['talk_topic'] = [extTalkTopic, mainTalkTopic, charUseSoulDust, charUpdateLevel];
}
exports.createCharTalkTopic = createCharTalkTopic;
