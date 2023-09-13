/**重量 */
export type Weight = number | `${number} ${"kg" | "g"}`;
/**体积 */
export type Volume = number | `${number} ${"L" | "ml"}`;
/**可用的颜色列表 */
export declare const ColorList: readonly ["blue", "white", "brown", "dark_gray"];
/**可用的颜色 */
export type Color = typeof ColorList[number];
/**肢体组 */
declare const PartSet: readonly ["head", "leg_l", "leg_r", "foot_l", "foot_r", "arm_l", "arm_r", "hand_l", "hand_r", "torso"];
/**肢体 */
export type BodyPart = typeof PartSet[number];
/**npc阵营 列表 */
export declare const DefineNpcFactionList: readonly ["your_followers", "no_faction"];
/**npc阵营 */
export type DefineNpcFaction = typeof DefineNpcFactionList[number];
/**怪物阵营 列表 */
export declare const DefineMonFactionList: readonly ["player", "human", "zombie", "passive_machine"];
/**怪物阵营 */
export type DefineMonFaction = typeof DefineMonFactionList[number];
export {};
