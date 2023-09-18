"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageTypeList = exports.DefineMonFactionList = exports.DefineNpcFactionList = exports.BodyPartList = exports.ColorList = void 0;
/**可用的颜色列表 */
exports.ColorList = ["blue", "white", "brown", "dark_gray"];
/**必要的肢体组 */
const VitalBPList = [
    "torso",
    "head",
];
/**四肢组 */
const LimbBPList = [
    "leg_l", "leg_r",
    "arm_l", "arm_r",
];
/**子肢体组 */
const SubBPList = [
    "foot_l", "foot_r",
    "hand_l", "hand_r",
];
/**组肢体 */
exports.BodyPartList = [...VitalBPList, ...LimbBPList, ...SubBPList];
/**npc阵营 列表 */
exports.DefineNpcFactionList = [
    "your_followers",
    "no_faction",
];
/**怪物阵营 列表 */
exports.DefineMonFactionList = [
    "player",
    "human",
    "zombie",
    "passive_machine",
];
/**伤害类型 列表 */
exports.DamageTypeList = [
    "stab",
    "bash",
    "cut",
    "bullet",
    "acid",
    "elec",
    "heat",
    "cold",
    "pure",
    "bio"
];
