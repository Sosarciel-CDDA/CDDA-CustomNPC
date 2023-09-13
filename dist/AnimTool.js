"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimTool = exports.formatAnimName = exports.AnimTypeList = void 0;
const CddaJsonFormat_1 = require("./CddaJsonFormat");
const Mutattion_1 = require("./CddaJsonFormat/Mutattion");
const DataManager_1 = require("./DataManager");
const ItemGroup_1 = require("./CddaJsonFormat/ItemGroup");
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
            integrated_armor: [(0, CddaJsonFormat_1.genArmorID)(animName)],
            points: 0,
        };
        const animArmor = {
            type: "ARMOR",
            id: (0, CddaJsonFormat_1.genArmorID)(animName),
            name: `${charName}的${animType}动画变异`,
            description: `${charName}的${animType}动画变异`,
            category: "clothing",
            weight: 0,
            volume: 0,
            symbol: "O",
            flags: ["AURA", "UNBREAKABLE", "INTEGRATED", "ZERO_WEIGHT"]
        };
        const animArmorGroup = {
            type: "item_group",
            id: (0, ItemGroup_1.genItemGroupID)(animName),
            subtype: "collection",
            items: [(0, CddaJsonFormat_1.genArmorID)(animName)]
        };
        await (0, DataManager_1.outCharFile)(charName, 'anim_tool.json', [animMut, animArmor, animArmorGroup]);
    }
}
exports.createAnimTool = createAnimTool;
