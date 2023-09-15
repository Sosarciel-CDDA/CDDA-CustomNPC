/**重量 */
export type Weight = number | `${number} ${"kg" | "g"}`;
/**体积 */
export type Volume = number | `${number} ${"L" | "ml"}`;
/**可用的颜色列表 */
export declare const ColorList: readonly ["blue", "white", "brown", "dark_gray"];
/**可用的颜色 */
export type Color = typeof ColorList[number];
/**必要的肢体组 */
declare const VitalBPList: readonly ["torso", "head"];
/**必要的肢体 */
type VitalBP = typeof VitalBPList[number];
/**四肢组 */
declare const LimbBPList: readonly ["leg_l", "leg_r", "arm_l", "arm_r"];
/**四肢 */
type LimbBP = typeof LimbBPList[number];
/**子肢体组 */
declare const SubBPList: readonly ["foot_l", "foot_r", "hand_l", "hand_r"];
/**子肢体 */
type SubBP = typeof SubBPList[number];
/**组肢体 */
export declare const BodyPartList: readonly ["torso", "head", "leg_l", "leg_r", "arm_l", "arm_r", "foot_l", "foot_r", "hand_l", "hand_r"];
/**肢体 */
export type BodyPart = VitalBP | LimbBP | SubBP;
/**npc阵营 列表 */
export declare const DefineNpcFactionList: readonly ["your_followers", "no_faction"];
/**npc阵营 */
export type DefineNpcFaction = typeof DefineNpcFactionList[number];
/**怪物阵营 列表 */
export declare const DefineMonFactionList: readonly ["player", "human", "zombie", "passive_machine"];
/**怪物阵营 */
export type DefineMonFaction = typeof DefineMonFactionList[number];
export {};
