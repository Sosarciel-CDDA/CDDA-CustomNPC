"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharTalkTopic = exports.getFieldVarID = void 0;
const _1 = require(".");
/**获取强化字段的变量ID */
function getFieldVarID(charName, field) {
    return `${charName}_Upg_${field}`;
}
exports.getFieldVarID = getFieldVarID;
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
    /**升级项列表 */
    const upgRespList = [];
    const upgEocList = [];
    //遍历升级项
    for (const upgObj of charConfig.upgrade || []) {
        const fieldID = getFieldVarID(charName, upgObj.field);
        //遍历升级项等级
        const maxLvl = upgObj.max_lvl || upgObj.require_resource.length;
        for (let lvl = 0; lvl < maxLvl; lvl++) {
            //获取当前等级材料 [ID, number][]
            const rawresource = lvl > upgObj.require_resource.length
                ? upgObj.require_resource[upgObj.require_resource.length - 1]
                : upgObj.require_resource[lvl];
            const resource = rawresource.map(item => {
                if (!Array.isArray(item))
                    return [item, 1];
                return item;
            });
            //条件
            const cond = { and: [
                    { math: [fieldID, "==", lvl + ""] },
                    ...resource.map(item => ({ u_has_items: {
                            item: item[0],
                            count: item[1]
                        } }))
                ] };
            const upgEocId = (0, _1.genEOCID)(`${fieldID}_UpgradeEoc`);
            /**使用材料 */
            const charUpEoc = {
                type: "effect_on_condition",
                id: upgEocId,
                eoc_type: "ACTIVATION",
                effect: [
                    ...resource.map(item => ({
                        u_consume_item: item[0],
                        count: item[1],
                        popup: true
                    })),
                    { math: [fieldID, "+=", "1"] },
                    { u_message: `${charName} 升级了 ${upgObj.field}` },
                ],
                condition: cond
            };
            upgEocList.push(charUpEoc);
            /**对话 */
            const resptext = `${upgObj.field} 消耗:${resource.map(item => `<item_name:${item[0]}>:${item[1]} `).join("")}`;
            const charUpResp = {
                condition: { math: [fieldID, "==", lvl + ""] },
                truefalsetext: {
                    true: `[可以升级]${resptext}`,
                    false: `<color_red>[素材不足]${resptext}</color>`,
                    condition: cond,
                },
                topic: defineData.talkTopicID,
                effect: { run_eocs: upgEocId }
            };
            upgRespList.push(charUpResp);
        }
    }
    /**主对话 */
    const mainTalkTopic = {
        type: "talk_topic",
        id: defineData.talkTopicID,
        dynamic_line: "...",
        responses: [...upgRespList, {
                condition: { npc_has_trait: defineData.baseMutID },
                text: "[继续]走吧。",
                topic: "TALK_DONE"
            }]
    };
    outData['talk_topic'] = [extTalkTopic, mainTalkTopic, ...upgEocList];
}
exports.createCharTalkTopic = createCharTalkTopic;
