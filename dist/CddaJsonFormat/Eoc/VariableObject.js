"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoParamTalkerCondList = void 0;
/**双Talker无参条件列表 */
exports.NoParamTalkerCondList = [
    "female",
    "male",
    "can_drop_weapon",
    "is_alive",
    "has_weapon", //挥舞着任意物品
];
/**选择地块的模式 列表 */
const QueryTileTypeList = [
    "anywhere",
    "line_of_sight",
    "around", //与点燃火源相同, 你只能选择紧邻的9个瓷砖
];
