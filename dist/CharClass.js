"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharClass = void 0;
const NpcInstance_1 = require("./CddaJsonFormat/NpcInstance");
const Data_1 = require("./Data");
/**创建角色职业和实例
 * @param charName 角色名
 */
async function createCharClass(charName) {
    const charClass = {
        type: "npc_class",
        id: (0, NpcInstance_1.genNpcInstanceID)(charName),
        name: charName,
        job_description: `${charName}专用的职业`,
        common: false,
    };
    const charInstance = {
        type: "npc",
        id: (0, NpcInstance_1.genNpcInstanceID)(charName),
        name_unique: charName,
    };
    await (0, Data_1.outCharFile)(charName, 'npc.json', [charClass, charInstance]);
}
exports.createCharClass = createCharClass;
