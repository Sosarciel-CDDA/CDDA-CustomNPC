import { MutationID } from "cdda-schema";
/**获取角色变异ID */
export declare const getCharMutId: (charName: string) => MutationID;
/**获取职业ID */
export declare const getCharClassId: (charName: string) => import("cdda-schema").NpcClassID;
/**获取实例ID */
export declare const getCharInstanceId: (charName: string) => import("cdda-schema").NpcInstanceID;
/**获取基础装甲ID */
export declare const getCharBaseArmorId: (charName: string) => import("cdda-schema").ArmorID;
/**获取基础附魔ID */
export declare const getCharBaseEnchId: (charName: string) => import("cdda-schema").EnchantmentID;
/**获取基础物品标志ID */
export declare const getCharBaseItemFlagId: (charName: string) => import("cdda-schema").FlagID;
/**获取基础携带组 */
export declare const getCharBaseCarryGroup: (charName: string) => import("cdda-schema").ItemGroupID;
/**获取对话主题ID */
export declare const getCharTalkTopicId: (charName: string) => import("cdda-schema").TalkTopicID;
/**获取卡片ID */
export declare const getCharCardId: (charName: string) => import("cdda-schema").GenericID;
/**获取全局的强化字段的变量ID */
export declare function getGlobalFieldVarID(charName: string, field: string): string;
export declare function getTalkerFieldVarID(talker: "u" | "n", field: string): string;
/**获取角色展示名 */
export declare const getCharDisplayName: (charName: string) => string;
