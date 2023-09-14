/**重量 */
export type Weight = number|`${number} ${"kg"|"g"}`;
/**体积 */
export type Volume = number|`${number} ${"L"|"ml"}`

/**可用的颜色列表 */
export const ColorList = ["blue","white","brown","dark_gray"] as const;
/**可用的颜色 */
export type Color = typeof ColorList[number];


/**必要的肢体组 */
const VitalBPList = [
    "torso" ,
    "head"  ,
] as const;
/**必要的肢体 */
type VitalBP = typeof VitalBPList[number];

/**四肢组 */
const LimbBPList = [
    "leg_l" , "leg_r" ,
    "arm_l" , "arm_r" ,
] as const;
/**四肢 */
type LimbBP = typeof LimbBPList[number];

/**子肢体组 */
const SubBPList = [
    "foot_l", "foot_r",
    "hand_l", "hand_r",
] as const;
/**子肢体 */
type SubBP = typeof SubBPList[number];

/**组肢体 */
export const BodyPartList = [...VitalBPList,...LimbBPList,...SubBPList] as const;
/**肢体 */
export type BodyPart = VitalBP|LimbBP|SubBP;


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
