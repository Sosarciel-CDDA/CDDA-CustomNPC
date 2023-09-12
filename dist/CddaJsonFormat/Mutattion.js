"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genMutationID = void 0;
const Data_1 = require("../Data");
/**生成适用于此mod的 变异ID */
function genMutationID(id) {
    return `${Data_1.MOD_PREFIX}_MUT_${id}`;
}
exports.genMutationID = genMutationID;
/**肢体组 */
const PartSet = ["head", "leg_l", "leg_r", "foot_l", "foot_r",
    "arm_l", "arm_r", "hand_l", "hand_r", "torso"];
