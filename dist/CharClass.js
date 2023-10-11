"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharClass = void 0;
const ModDefine_1 = require("./ModDefine");
const StaticData_1 = require("./StaticData");
/**创建角色职业和实例
 * @param charName 角色名
 */
async function createCharClass(dm, charName) {
    const { defineData, outData, charConfig } = await dm.getCharData(charName);
    /**NPC职业 */
    const charClass = {
        type: "npc_class",
        id: defineData.classID,
        name: charName,
        job_description: `${charName}专用的职业`,
        common: false,
        worn_override: StaticData_1.EMPTY_GROUP_ID,
        weapon_override: StaticData_1.EMPTY_GROUP_ID,
        carry_override: defineData.baseCarryGroup,
        skills: Object.entries(charConfig.base_skill || []).reduce((acc, item) => {
            if (item[1] == null)
                return acc;
            const skillid = item[0];
            const skill = {
                skill: skillid,
                level: { constant: item[1] }
            };
            return [...acc, skill];
        }, []),
        traits: [
            { "trait": (0, ModDefine_1.genMutationID)("CnpcFlag") },
            { "trait": defineData.baseMutID },
            ...(defineData.vaildAnim.length >= 1
                ? [{ "trait": defineData.animData.Idle.mutID }, { "trait": "TOUGH_FEET" }]
                : [{ "trait": (0, ModDefine_1.genMutationID)("NoAnim") }])
        ]
    };
    /**NPC实例 */
    const charInstance = {
        type: "npc",
        id: defineData.instanceID,
        name_unique: charName,
        class: defineData.classID,
        faction: "your_followers",
        chat: "TALK_DONE",
        attitude: 3,
        mission: 0,
        str: charConfig.base_status?.str || 10,
        dex: charConfig.base_status?.dex || 10,
        int: charConfig.base_status?.int || 10,
        per: charConfig.base_status?.per || 10,
        height: charConfig.desc?.height,
        age: charConfig.desc?.age,
        gender: charConfig.desc?.gender,
        death_eocs: ["CNPC_EOC_NPC_DEATH"], //设置事件字段
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
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(spawnerId),
        effect: [
            //{ u_consume_item: genGenericID(spawnerId), count: 1 },
            { math: [`${charName}_uid`, "+=", "1"] },
            {
                u_spawn_npc: defineData.instanceID,
                real_count: 1,
                min_radius: 1,
                max_radius: 1,
            },
        ],
    };
    /**初始化事件 */
    const charInitEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${charName}_InitProcess`),
        effect: [
            { math: [`u_uid`, "=", `${charName}_uid`] },
        ]
    };
    dm.addCharEvent(charName, "CharInit", 1000, charInitEoc);
    /**销毁事件 */
    const charRemoveEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${charName}_RemoveProcess`),
        effect: [
            { run_eocs: "CNPC_EOC_DeathProcess" }
        ],
        condition: { math: ["u_uid", "!=", `${charName}_uid`] }
    };
    dm.addCharEvent(charName, "CharUpdate", 0, charRemoveEoc);
    /**死亡事件 */
    const charDeathEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(`${charName}_DeathProcess`),
        effect: []
    };
    dm.addCharEvent(charName, "CharDeath", -1000, charDeathEoc);
    outData['npc'] = [charClass, charInstance, charSpawner, charSpawnerEoc, charDeathEoc, charInitEoc, charRemoveEoc];
}
exports.createCharClass = createCharClass;
