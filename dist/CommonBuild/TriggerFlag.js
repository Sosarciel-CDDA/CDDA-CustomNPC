"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTriggerFlag = void 0;
const ModDefine_1 = require("../ModDefine");
const StaticData_1 = require("../StaticData");
async function createTriggerFlag(dm) {
    await shotInterval(dm);
}
exports.createTriggerFlag = createTriggerFlag;
/**射击间隔 */
async function shotInterval(dm) {
    const baseId = "SHOTINT";
    const numVar = [30, 70, 100, 140, 1000];
    const outlist = [];
    for (let num of numVar) {
        const flagid = `${baseId}_${num}`;
        const flag = {
            type: "json_flag",
            id: flagid
        };
        const triggerEoc = (0, ModDefine_1.genActEoc)(flagid, [
            { math: [StaticData_1.SPELL_CT_MODMOVE_VAR, "=", num + ""] },
            { u_cast_spell: { id: StaticData_1.SPELL_CT_MODMOVE, hit_self: true } },
        ], { u_has_wielded_with_flag: flagid });
        dm.addEvent("TryRangeAttack", 0, triggerEoc);
        outlist.push(flag, triggerEoc);
    }
    dm.addStaticData([...outlist], "common_resource", "trigger_flag", "shot_interval");
}
