"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimTool = exports.formatAnimName = exports.AnimTypeList = void 0;
const path = require("path");
const cdda_schema_1 = require("cdda-schema");
/**可用的动画类型列表 */
exports.AnimTypeList = ["Idle", "Move", "Attack"];
/**生成某角色的动作id */
function formatAnimName(charName, animType) {
    return `${charName}${animType}`;
}
exports.formatAnimName = formatAnimName;
/**创建动画辅助工具
 * @param charName 角色名
 */
async function createAnimTool(dm, charName) {
    const { defineData, outData } = await dm.getCharData(charName);
    for (const animType of defineData.validAnim) {
        const animData = defineData.animData[animType];
        const animMut = {
            type: "mutation",
            id: animData.mutID,
            name: `${charName}的${animType}动画变异`,
            description: `${charName}的${animType}动画变异`,
            //integrated_armor:[animData.armorID],
            restricts_gear: [...cdda_schema_1.BodyPartList],
            remove_rigid: [...cdda_schema_1.BodyPartList],
            points: 0,
            purifiable: false,
            valid: false,
            player_display: false,
        };
        const animArmor = {
            type: "ARMOR",
            id: animData.armorID,
            name: `${charName}的${animType}动画变异装备`,
            description: `${charName}的${animType}动画变异装备`,
            category: "clothing",
            weight: 0,
            volume: 0,
            symbol: "O",
            flags: ["AURA", "UNBREAKABLE", "INTEGRATED", "ZERO_WEIGHT"],
        };
        const animArmorGroup = {
            type: "item_group",
            id: animData.itemGroupID,
            subtype: "collection",
            items: [animData.armorID]
        };
        outData[path.join("anime", animType)] = [animMut, animArmor, animArmorGroup];
    }
}
exports.createAnimTool = createAnimTool;
