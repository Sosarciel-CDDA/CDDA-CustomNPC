import { CMDef } from "CMDefine";
import { MutationID } from "@sosarciel-cdda/sclema";



/**获取角色变异ID */
export const getCharMutId = (charName:string) =>
	`${charName}_cnpc` as MutationID;

/**获取职业ID */
export const getCharClassId = (charName:string) =>
	CMDef.genNpcClassID(`${charName}_NpcClassID`);

/**获取实例ID */
export const getCharInstanceId = (charName:string) =>
	CMDef.genNpcInstanceID(`${charName}_NpcInstanceID`);

/**获取基础装甲ID */
export const getCharBaseArmorId = (charName:string) =>
	CMDef.genArmorID(`${charName}_ArmorID`);

/**获取基础附魔ID */
export const getCharBaseEnchId = (charName:string) =>
	CMDef.genEnchantmentID(`${charName}_EnchantmentID`);

/**获取基础物品标志ID */
export const getCharBaseItemFlagId = (charName:string) =>
	CMDef.genFlagID(`${charName}_WeaponFlag_FlagID`);

/**获取基础携带组 */
export const getCharBaseCarryGroup = (charName:string) =>
	CMDef.genItemGroupID(`${charName}_Carry_ItemGroupID`);

/**获取对话主题ID */
export const getCharTalkTopicId = (charName:string) =>
	CMDef.genTalkTopicID(`${charName}_TalkTopicID`);

/**获取卡片ID */
export const getCharCardId = (charName:string) =>
	CMDef.genGenericID(`${charName}_Card_GenericID`);


/**获取全局的强化字段的变量ID */
export function getGlobalFieldVarID(charName:string,field:string){
    return `${charName}_${field}`;
}
export function getTalkerFieldVarID(talker:"u"|"n",field:string){
    return `${talker}_${field}`;
}

/**获取角色展示名 */
export const getCharDisplayName = (charName:string) =>
	charName.replaceAll("_"," ");
