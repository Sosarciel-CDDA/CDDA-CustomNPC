"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterFlagList = exports.MonsterBPList = void 0;
/**怪物的身体类型 列表 */
exports.MonsterBPList = [
    "angel",
    "bear",
    "bird",
    "blob",
    "crab",
    "dog",
    "elephant",
    "fish",
    "flying insect",
    "frog",
    "gator",
    "horse",
    "human",
    "insect",
    "kangaroo",
    "lizard",
    "migo",
    "pig",
    "spider",
    "snake", // 一种身体长，无肢体的动物
];
/**怪物可用的Flag 列表 */
exports.MonsterFlagList = [
    "SEES",
    "HEARS",
    "NOHEAD",
    "HARDTOSHOOT",
    "FLIES",
    "PRIORITIZE_TARGETS",
    "NO_BREATHE",
    "NOGIB", //这个怪物被超量伤害杀死时不会爆成碎块
];
