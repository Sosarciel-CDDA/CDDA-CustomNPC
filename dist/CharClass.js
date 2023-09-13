"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharClass = void 0;
const AnimTool_1 = require("./AnimTool");
const EOC_1 = require("./CddaJsonFormat/EOC");
const Item_1 = require("./CddaJsonFormat/Item");
const ItemGroup_1 = require("./CddaJsonFormat/ItemGroup");
const NpcClass_1 = require("./CddaJsonFormat/NpcClass");
const NpcInstance_1 = require("./CddaJsonFormat/NpcInstance");
const DataManager_1 = require("./DataManager");
/**创建角色职业和实例
 * @param charName 角色名
 */
async function createCharClass(charName) {
    const charClass = {
        type: "npc_class",
        id: (0, NpcClass_1.genNpcClassID)(charName),
        name: charName,
        job_description: `${charName}专用的职业`,
        common: false,
        worn_override: (0, ItemGroup_1.genItemGroupID)((0, AnimTool_1.formatAnimName)(charName, "Idle"))
    };
    const charInstance = {
        type: "npc",
        id: (0, NpcInstance_1.genNpcInstanceID)(charName),
        name_unique: charName,
        class: (0, NpcClass_1.genNpcClassID)(charName),
        faction: "your_followers",
        chat: "TALK_DONE",
        attitude: 0,
        mission: 0,
    };
    const spawnerId = `${charName}_Spawner`;
    const charSpawner = {
        type: "GENERIC",
        id: (0, Item_1.genGenericID)(spawnerId),
        name: `${charName}生成器`,
        description: `生成一个${charName}`,
        use_action: {
            type: "effect_on_conditions",
            description: `生成一个${charName}`,
            effect_on_conditions: [(0, EOC_1.genEOCID)(spawnerId)],
        },
        weight: 1,
        volume: 1,
        symbol: "O"
    };
    const charSpawnerEoc = {
        type: "effect_on_condition",
        id: (0, EOC_1.genEOCID)(spawnerId),
        effect: [
            //{ u_consume_item: genGenericID(spawnerId), count: 1 },
            {
                u_spawn_npc: (0, NpcInstance_1.genNpcInstanceID)(charName),
                real_count: 1,
                min_radius: 1,
                max_radius: 1,
            },
        ],
    };
    await (0, DataManager_1.outCharFile)(charName, 'npc.json', [charClass, charInstance, charSpawner, charSpawnerEoc]);
}
exports.createCharClass = createCharClass;
