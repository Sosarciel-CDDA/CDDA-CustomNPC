"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genMonsterID = exports.genSpellID = exports.genNpcInstanceID = exports.genNpcClassID = exports.genMutationID = exports.genItemGroupID = exports.genEOCID = exports.genGenericID = exports.genArmorID = exports.MOD_PREFIX = void 0;
/**mod物品前缀 */
exports.MOD_PREFIX = "CNPC";
/**生成适用于此mod的ARMOR ID */
function genArmorID(id) {
    return `${exports.MOD_PREFIX}_ARMOR_${id}`;
}
exports.genArmorID = genArmorID;
/**生成适用于此mod的 通用物品 ID */
function genGenericID(id) {
    return `${exports.MOD_PREFIX}_GENERIC_${id}`;
}
exports.genGenericID = genGenericID;
/**生成适用于此mod的 EOC ID */
function genEOCID(id) {
    return `${exports.MOD_PREFIX}_NPC_${id}`;
}
exports.genEOCID = genEOCID;
/**生成适用于此mod的 物品组ID */
function genItemGroupID(id) {
    return `${exports.MOD_PREFIX}_ITEMGROUP_${id}`;
}
exports.genItemGroupID = genItemGroupID;
/**生成适用于此mod的 变异ID */
function genMutationID(id) {
    return `${exports.MOD_PREFIX}_MUT_${id}`;
}
exports.genMutationID = genMutationID;
/**生成适用于此mod的 NPC职业ID */
function genNpcClassID(id) {
    return `${exports.MOD_PREFIX}_NPCLASS_${id}`;
}
exports.genNpcClassID = genNpcClassID;
/**生成适用于此mod的 NPCID */
function genNpcInstanceID(id) {
    return `${exports.MOD_PREFIX}_NPC_${id}`;
}
exports.genNpcInstanceID = genNpcInstanceID;
/**生成适用于此mod的 法术ID */
function genSpellID(id) {
    return `${exports.MOD_PREFIX}_SPELL_${id}`;
}
exports.genSpellID = genSpellID;
/**生成适用于此mod的 怪物ID */
function genMonsterID(id) {
    return `${exports.MOD_PREFIX}_MON_${id}`;
}
exports.genMonsterID = genMonsterID;
