"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharClass = createCharClass;
const CMDefine_1 = require("../CMDefine");
const StaticData_1 = require("../StaticData");
const CharData_1 = require("./CharData");
const UtilGener_1 = require("./UtilGener");
/**创建角色职业和实例
 * @param charName 角色名
 */
async function createCharClass(dm, charName) {
    const charConfig = await (0, CharData_1.getCharConfig)(charName);
    const displayName = (0, UtilGener_1.getCharDisplayName)(charName);
    /**NPC职业 */
    const charClass = {
        type: "npc_class",
        id: (0, UtilGener_1.getCharClassId)(charName),
        name: displayName,
        job_description: `${displayName}专用的职业`,
        common: false,
        worn_override: StaticData_1.EMPTY_GROUP_ID,
        weapon_override: StaticData_1.EMPTY_GROUP_ID,
        carry_override: (0, UtilGener_1.getCharBaseCarryGroup)(charName),
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
        spells: charConfig.base_spell,
        traits: [
            { "trait": CMDefine_1.CMDef.genMutationID("CnpcFlag") },
            { "trait": (0, UtilGener_1.getCharMutId)(charName) },
            ...(charConfig.base_mutation ?? [])
                .map(mut => ({ trait: mut })),
        ]
    };
    /**NPC实例 */
    const charInstance = {
        type: "npc",
        id: (0, UtilGener_1.getCharInstanceId)(charName),
        name_unique: displayName,
        class: (0, UtilGener_1.getCharClassId)(charName),
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
    };
    /**初始化事件 */
    const charInitEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: CMDefine_1.CMDef.genEOCID(`${charName}_InitProcess`),
        effect: [
            { if: { math: [`${charName}_hasInstance`, "==", "1"] },
                then: [{ math: ["u_needRemove", "=", "1"] }] },
            { math: [`${charName}_hasInstance`, "=", "1"] }
        ]
    };
    dm.addCharInvokeEoc(charName, "Init", 1000, charInitEoc);
    /**销毁事件 */
    const charRemoveEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: CMDefine_1.CMDef.genEOCID(`${charName}_RemoveProcess`),
        effect: [
            { run_eocs: "CNPC_EOC_CnpcDeathProcess" }
        ],
        condition: { math: ["u_needRemove", "==", `1`] }
    };
    dm.addCharInvokeEoc(charName, "Update", 0, charRemoveEoc);
    dm.addCharData(charName, [charClass, charInstance, charInitEoc, charRemoveEoc], 'npc');
}
