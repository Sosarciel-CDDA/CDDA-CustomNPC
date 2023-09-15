"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharClass = void 0;
const ModDefine_1 = require("./ModDefine");
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
        worn_override: (0, ModDefine_1.genItemGroupID)("EmptyGroup"),
        weapon_override: baseData.baseWeaponGroupID,
        carry_override: (0, ModDefine_1.genItemGroupID)("EmptyGroup"),
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
        id: (0, ModDefine_1.genGenericID)(spawnerId),
        name: `${charName}生成器`,
        description: `生成一个${charName}`,
        use_action: {
            type: "effect_on_conditions",
            description: `生成一个${charName}`,
            effect_on_conditions: [(0, ModDefine_1.genEOCID)(spawnerId)],
        },
        weight: 1,
        volume: 1,
        symbol: "O"
    };
    /**生成器EOC */
    const charSpawnerEoc = {
        type: "effect_on_condition",
        id: (0, ModDefine_1.genEOCID)(spawnerId),
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
    outData['npc'] = [charClass, charInstance, charSpawner, charSpawnerEoc];
}
exports.createCharClass = createCharClass;
