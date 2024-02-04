"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharGener = void 0;
const UtilGener_1 = require("./UtilGener");
const CMDefine_1 = require("../CMDefine");
async function createCharGener(dm, charName) {
    const displayName = (0, UtilGener_1.getCharDisplayName)(charName);
    /**生成器ID */
    const spawnerId = `${charName}_Spawner`;
    /**生成器 */
    const charSpawner = {
        type: "GENERIC",
        id: CMDefine_1.CMDef.genGenericID(spawnerId),
        name: { str_sp: `${displayName} 生成器` },
        description: `生成一个 ${displayName}`,
        use_action: {
            type: "effect_on_conditions",
            description: `生成一个 ${displayName}`,
            menu_text: `生成一个 ${displayName}`,
            effect_on_conditions: [CMDefine_1.CMDef.genEOCID(spawnerId)],
        },
        weight: 1,
        volume: 1,
        symbol: "O"
    };
    /**生成器EOC */
    const charSpawnerEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: CMDefine_1.CMDef.genEOCID(spawnerId),
        effect: [
            //{ u_consume_item: CMDef.genGenericID(spawnerId), count: 1 },
            { math: [`${charName}_uid`, "+=", "1"] },
            {
                u_spawn_npc: (0, UtilGener_1.getCharInstanceId)(charName),
                real_count: 1,
                min_radius: 1,
                max_radius: 1,
            },
        ],
    };
    //卡片冷却变量
    const cardcdvar = `${charName}_cooldown`;
    /**卡片EOC */
    const charCardEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: CMDefine_1.CMDef.genEOCID(`${charName}_Card_Eoc`),
        effect: [
            { u_add_var: cardcdvar, time: true },
            { math: [`${charName}_uid`, "+=", "1"] },
            {
                u_spawn_npc: (0, UtilGener_1.getCharInstanceId)(charName),
                real_count: 1,
                min_radius: 1,
                max_radius: 1,
            },
        ],
        condition: { or: [
                { u_compare_time_since_var: cardcdvar, op: ">=", time: "1 d" },
                { not: { u_has_var: cardcdvar, time: true } }
            ] },
        false_effect: [{ u_message: "卡片没什么反应, 等一会再试吧……" }]
    };
    /**卡片 */
    const charCard = {
        type: "GENERIC",
        id: (0, UtilGener_1.getCharCardId)(charName),
        name: { str_sp: `${displayName} 卡片` },
        description: `召唤 ${displayName}`,
        use_action: {
            type: "effect_on_conditions",
            description: `召唤 ${displayName}`,
            menu_text: `召唤 ${displayName}`,
            effect_on_conditions: [charCardEoc.id],
        },
        flags: ["UNBREAKABLE"],
        weight: 1,
        volume: 1,
        symbol: ",",
        looks_like: "memory_card"
    };
    dm.addCharStaticData(charName, [charSpawner, charSpawnerEoc, charCardEoc, charCard], 'gener');
}
exports.createCharGener = createCharGener;
