"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genActEoc = exports.genTalkTopicID = exports.genFlagID = exports.genAmmuTypeID = exports.genMonsterID = exports.genSpellID = exports.genNpcInstanceID = exports.genNpcClassID = exports.genMutationID = exports.genItemGroupID = exports.genEffectID = exports.genEOCID = exports.genAmmoID = exports.genGunID = exports.genGenericID = exports.genEnchantmentID = exports.genArmorID = exports.MOD_PREFIX = void 0;
/**mod物品前缀 */
exports.MOD_PREFIX = "CNPC";
/**生成适用于此mod的ARMOR ID */
function genArmorID(id) {
    return `${exports.MOD_PREFIX}_ARMOR_${id}`;
}
exports.genArmorID = genArmorID;
/**生成适用于此mod的附魔 ID */
function genEnchantmentID(id) {
    return `${exports.MOD_PREFIX}_ENCH_${id}`;
}
exports.genEnchantmentID = genEnchantmentID;
/**生成适用于此mod的 通用物品 ID */
function genGenericID(id) {
    return `${exports.MOD_PREFIX}_GENERIC_${id}`;
}
exports.genGenericID = genGenericID;
/**生成适用于此mod的 枪械 ID */
function genGunID(id) {
    return `${exports.MOD_PREFIX}_GUN_${id}`;
}
exports.genGunID = genGunID;
/**生成适用于此mod的 子弹 ID */
function genAmmoID(id) {
    return `${exports.MOD_PREFIX}_AMMO_${id}`;
}
exports.genAmmoID = genAmmoID;
/**生成适用于此mod的 EOC ID */
function genEOCID(id) {
    return `${exports.MOD_PREFIX}_EOC_${id}`;
}
exports.genEOCID = genEOCID;
/**生成适用于此mod的 Effect ID */
function genEffectID(id) {
    return `${exports.MOD_PREFIX}_EFF_${id}`;
}
exports.genEffectID = genEffectID;
/**生成适用于此mod的 物品组ID */
function genItemGroupID(id) {
    return `${exports.MOD_PREFIX}_ITEMGP_${id}`;
}
exports.genItemGroupID = genItemGroupID;
/**生成适用于此mod的 变异ID */
function genMutationID(id) {
    return `${exports.MOD_PREFIX}_MUT_${id}`;
}
exports.genMutationID = genMutationID;
/**生成适用于此mod的 NPC职业ID */
function genNpcClassID(id) {
    return `${exports.MOD_PREFIX}_NPCCLS_${id}`;
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
/**生成适用于此mod的 材质类型 ID */
function genAmmuTypeID(id) {
    return `${exports.MOD_PREFIX}_AMMUNIT_${id}`;
}
exports.genAmmuTypeID = genAmmuTypeID;
/**生成适用于此mod的 FLAG ID */
function genFlagID(id) {
    return `${exports.MOD_PREFIX}_FLAG_${id}`;
}
exports.genFlagID = genFlagID;
/**生成适用于此mod的 TalkTopic ID */
function genTalkTopicID(id) {
    return `${exports.MOD_PREFIX}_TALKTC_${id}`;
}
exports.genTalkTopicID = genTalkTopicID;
/**生成适用此mod的触发eoc
 * @param forceId 强制使用原id
*/
function genActEoc(id, effect, condition, forceId = false) {
    return {
        type: "effect_on_condition",
        id: forceId ? id : genEOCID(id),
        eoc_type: "ACTIVATION",
        effect, condition
    };
}
exports.genActEoc = genActEoc;
