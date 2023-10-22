"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OMTMatchTypeList = exports.EmptyMissionDialog = void 0;
/**任务目标 列表*/
const MissionGoalList = [
    "MGOAL_GO_TO",
    "MGOAL_GO_TO_TYPE",
    "MGOAL_COMPUTER_TOGGLE",
    "MGOAL_FIND_ITEM",
    "MGOAL_FIND_ANY_ITEM",
    "MGOAL_FIND_MONSTER",
    "MGOAL_FIND_NPC",
    "MGOAL_TALK_TO_NPC",
    "MGOAL_RECRUIT_NPC",
    "MGOAL_RECRUIT_NPC_CLASS",
    "MGOAL_ASSASSINATE",
    "MGOAL_KILL_MONSTER",
    "MGOAL_KILL_MONSTERS",
    "MGOAL_KILL_MONSTER_TYPE",
    "MGOAL_KILL_MONSTER_SPEC",
    "MGOAL_CONDITION", // 满足动态创建的条件并与任务赋予者交谈
];
/**任务来源 列表 */
const MissionOriginList = [
    "ORIGIN_GAME_START",
    "ORIGIN_OPENER_NPC",
    "ORIGIN_ANY_NPC",
    "ORIGIN_SECONDARY",
    "ORIGIN_COMPUTER", //阅读调查后在计算机终端中引发条目
];
/**空的任务对话字典 */
exports.EmptyMissionDialog = {
    describe: "",
    offer: "",
    accepted: "",
    rejected: "",
    advice: "",
    inquire: "",
    success: "",
    success_lie: "",
    failure: "",
};
/**地块匹配类型 列表 */
exports.OMTMatchTypeList = [
    "EXACT",
    "TYPE",
    "PREFIX",
    "CONTAINS", // 提供的字符串必须包含在覆盖地图地形 ID 中，但可以出现在开头、结尾或中间，并且没有任何关于下划线分隔的规则。
];
