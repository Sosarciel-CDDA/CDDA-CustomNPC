"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharDisplayName = exports.getCharCardId = exports.getCharTalkTopicId = exports.getCharBaseCarryGroup = exports.getCharBaseItemFlagId = exports.getCharBaseEnchId = exports.getCharBaseArmorId = exports.getCharInstanceId = exports.getCharClassId = exports.getCharMutId = void 0;
exports.getGlobalFieldVarID = getGlobalFieldVarID;
exports.getTalkerFieldVarID = getTalkerFieldVarID;
const CMDefine_1 = require("../CMDefine");
/**获取角色变异ID */
const getCharMutId = (charName) => `${charName}_cnpc`;
exports.getCharMutId = getCharMutId;
/**获取职业ID */
const getCharClassId = (charName) => CMDefine_1.CMDef.genNpcClassID(`${charName}_NpcClassID`);
exports.getCharClassId = getCharClassId;
/**获取实例ID */
const getCharInstanceId = (charName) => CMDefine_1.CMDef.genNpcInstanceID(`${charName}_NpcInstanceID`);
exports.getCharInstanceId = getCharInstanceId;
/**获取基础装甲ID */
const getCharBaseArmorId = (charName) => CMDefine_1.CMDef.genArmorID(`${charName}_ArmorID`);
exports.getCharBaseArmorId = getCharBaseArmorId;
/**获取基础附魔ID */
const getCharBaseEnchId = (charName) => CMDefine_1.CMDef.genEnchantmentID(`${charName}_EnchantmentID`);
exports.getCharBaseEnchId = getCharBaseEnchId;
/**获取基础物品标志ID */
const getCharBaseItemFlagId = (charName) => CMDefine_1.CMDef.genFlagID(`${charName}_WeaponFlag_FlagID`);
exports.getCharBaseItemFlagId = getCharBaseItemFlagId;
/**获取基础携带组 */
const getCharBaseCarryGroup = (charName) => CMDefine_1.CMDef.genItemGroupID(`${charName}_Carry_ItemGroupID`);
exports.getCharBaseCarryGroup = getCharBaseCarryGroup;
/**获取对话主题ID */
const getCharTalkTopicId = (charName) => CMDefine_1.CMDef.genTalkTopicID(`${charName}_TalkTopicID`);
exports.getCharTalkTopicId = getCharTalkTopicId;
/**获取卡片ID */
const getCharCardId = (charName) => CMDefine_1.CMDef.genGenericID(`${charName}_Card_GenericID`);
exports.getCharCardId = getCharCardId;
/**获取全局的强化字段的变量ID */
function getGlobalFieldVarID(charName, field) {
    return `${charName}_${field}`;
}
function getTalkerFieldVarID(talker, field) {
    return `${talker}_${field}`;
}
/**获取角色展示名 */
const getCharDisplayName = (charName) => charName.replaceAll("_", " ");
exports.getCharDisplayName = getCharDisplayName;
