/**重量 */
export type Weight = number|`${number} ${"kg"|"g"}`;
/**体积 */
export type Volume = number|`${number} ${"L"|"ml"}`

/**可用的颜色列表 */
export const ColorList = ["blue","white","brown","dark_gray"] as const;
/**可用的颜色 */
export type Color = typeof ColorList[number];


/**肢体组 */
const PartSet = ["head", "leg_l", "leg_r", "foot_l", "foot_r",
    "arm_l", "arm_r", "hand_l", "hand_r", "torso"] as const;
/**肢体 */
export type BodyPart = typeof PartSet[number];


/**npc阵营 列表 */
export const DefineNpcFactionList = [
    "your_followers",
    "no_faction",
] as const;
/**npc阵营 */
export type DefineNpcFaction = typeof DefineNpcFactionList[number];

/**怪物阵营 列表 */
export const DefineMonFactionList = [
    "player",
    "human",
    "zombie",
    "passive_machine",
] as const;
/**怪物阵营 */
export type DefineMonFaction = typeof DefineMonFactionList[number];
