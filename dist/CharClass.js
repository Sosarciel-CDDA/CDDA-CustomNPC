"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharClass = void 0;
const _1 = require(".");
const EOC_1 = require("./CddaJsonFormat/EOC");
const GenericDefine_1 = require("./CddaJsonFormat/GenericDefine");
const Item_1 = require("./CddaJsonFormat/Item");
/**创建角色职业和实例
 * @param charName 角色名
 */
async function createCharClass(dm, charName) {
    const { baseData, outData } = dm.getCharData(charName);
    /**NPC职业 */
    const charClass = {
        type: "npc_class",
        id: baseData.classID,
        name: charName,
        job_description: `${charName}专用的职业`,
        common: false,
        worn_override: (0, _1.genItemGroupID)("EmptyGroup"),
        weapon_override: (0, _1.genItemGroupID)("EmptyGroup"),
        carry_override: (0, _1.genItemGroupID)("EmptyGroup"),
        traits: [{ "trait": baseData.baseMutID }, { "trait": baseData.animData.Idle.mutID }]
    };
    /**NPC实例 */
    const charInstance = {
        type: "npc",
        id: baseData.instanceID,
        name_unique: charName,
        class: baseData.classID,
        faction: "your_followers",
        chat: "TALK_DONE",
        attitude: 0,
        mission: 0,
    };
    /**生成器ID */
    const spawnerId = `${charName}_Spawner`;
    /**生成器 */
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
    /**生成器EOC */
    const charSpawnerEoc = {
        type: "effect_on_condition",
        id: (0, EOC_1.genEOCID)(spawnerId),
        effect: [
            //{ u_consume_item: genGenericID(spawnerId), count: 1 },
            {
                u_spawn_npc: baseData.instanceID,
                real_count: 1,
                min_radius: 1,
                max_radius: 1,
            },
        ],
    };
    /**基础变异 */
    const baseMut = {
        type: "mutation",
        id: baseData.baseMutID,
        name: `${charName}的基础变异`,
        description: `${charName}的基础变异`,
        points: 0,
        restricts_gear: [...GenericDefine_1.BodyPartList],
        remove_rigid: [...GenericDefine_1.BodyPartList],
    };
    outData['npc'] = [charClass, charInstance, baseMut, charSpawner, charSpawnerEoc];
}
exports.createCharClass = createCharClass;
