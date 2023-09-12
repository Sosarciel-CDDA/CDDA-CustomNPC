"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimTool = exports.formatAnimName = exports.AnimTypeList = void 0;
const Armor_1 = require("./CddaJsonFormat/Armor");
const Mutattion_1 = require("./CddaJsonFormat/Mutattion");
const Data_1 = require("./Data");
/**可用的动画类型列表 */
exports.AnimTypeList = ["Idle"];
/**生成某角色的动作id */
function formatAnimName(charName, animType) {
    return `${charName}${animType}`;
}
exports.formatAnimName = formatAnimName;
/**创建动画辅助工具
 * @param charName 角色名
 */
async function createAnimTool(charName) {
    for (const animType of exports.AnimTypeList) {
        const animName = formatAnimName(charName, animType);
        const animMut = {
            type: "mutation",
            id: (0, Mutattion_1.genMutationID)(animName),
            name: `${charName}的${animType}动画变异`,
            description: `${charName}的${animType}动画变异`,
            integrated_armor: [(0, Armor_1.genArmorID)(animName)]
        };
        const animArmor = {
            type: "ARMOR",
            id: `CNPC_ARMOR_${animName}`,
            name: `${charName}的${animType}动画变异`,
            description: `${charName}的${animType}动画变异`,
            category: "clothing",
            weight: 0,
            volume: 0,
            armor: [{
                    layers: ["AURA"],
                }]
        };
        await (0, Data_1.outCharFile)(charName, 'anim_tool.json', [animMut, animArmor]);
    }
}
exports.createAnimTool = createAnimTool;
