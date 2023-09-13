"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineMonFactionList = exports.DefineNpcFactionList = exports.ColorList = void 0;
/**可用的颜色列表 */
exports.ColorList = ["blue", "white", "brown", "dark_gray"];
/**肢体组 */
const PartSet = ["head", "leg_l", "leg_r", "foot_l", "foot_r",
    "arm_l", "arm_r", "hand_l", "hand_r", "torso"];
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
