"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefineTopicList = exports.RespTraitTypeList = void 0;
/**可用的社交技能 列表 */
exports.RespTraitTypeList = ["NONE", "LIE", "PERSUADE", "INTIMIDATE", "CONDITION"];
/**预定义的对话 列表 */
exports.DefineTopicList = [
    "TALK_DONE", //结束对话
];
/**
assign_guard	让NPC变成守卫。如果结盟并且在一个营地，他们将被分配到该营地。
stop_guard	解除 NPC 的警卫职责（另请参阅assign_guard）。友好的 NPC 将恢复跟随。
start_camp	NPC将与玩家建立派系阵营。
wake_up	唤醒熟睡但未服用镇静剂的 NPC。
reveal_stats	根据玩家评估 NPC 的技能来显示 NPC 的统计数据。
end_conversation	结束对话并让 NPC 从此不再理你。
insult_combat	结束对话并使 NPC 产生敌意，添加一条消息，表明角色开始与 NPC 打斗。
hostile	使 NPC 产生敌意并结束对话。
flee	让 NPC 逃离你的角色。
follow	让NPC追随你的角色，加入“你的追随者”阵营。
leave	让NPC离开“你的追随者”阵营并停止追随你的角色。
follow_only	让 NPC 跟随你的角色而不改变派系。
stop_following	使 NPC 不再跟随你的角色而不改变派系。
npc_thankful	让 NPC 对你的角色产生积极的倾向。
drop_weapon	让 NPC 放下武器。
stranger_neutral	将 NPC 的态度改为中立。
start_mugging	NPC 会接近你的角色并从你的角色身上偷东西，如果你的角色抵抗就会攻击。
lead_to_safety	NPC 将获得 LEAD 态度并赋予你的角色到达安全的使命。
start_training	NPC 会训练你的角色的技能或武术。注意：当前代码要求您通过引导玩家"topic": "TALK_TRAIN"选择要训练的内容来启动训练。在“TALK_TRAIN”之外启动训练将给出错误。
start_training_npc	NPC将接受玩家的技能或武术训练。
start_training_seminar	打开一个对话框来选择哪些角色将参加该 NPC 主办的培训研讨会。
companion_mission: role_string	NPC 将根据 NPC 的角色为您的盟友 NPC 提供任务列表。
basecamp_mission	NPC 将为您的盟友 NPC 提供一份任务列表，具体取决于当地的大本营。
bionic_install	NPC 使用非常高的技能从你的角色库存中将仿生装置安装到你的角色上，并根据操作的难度向你收费。
bionic_remove	NPC 使用非常高的技能从你的角色中移除仿生生物，并根据操作的难度向你收费。
npc_class_change: 字符串或变量对象	将 NPC 的类别更改为新值。
npc_faction_change: 字符串或变量对象	将 NPC 的派系成员更改为新值。
u_faction_rep: int 或变量对象	提高您在 NPC 当前派系中的声望，如果值为负则降低声望。
toggle_npc_rule: 字符串或变量对象	切换布尔 NPC 追随者 AI 规则的值，例如"use_silent"或"allow_bash"
set_npc_rule: 字符串或变量对象	设置布尔 NPC 追随者 AI 规则的值，例如"use_silent"或"allow_bash"
clear_npc_rule: 字符串或变量对象	清除布尔 NPC 追随者 AI 规则的值，例如"use_silent"或"allow_bash"
set_npc_engagement_rule: 字符串或变量对象	将 NPC 追随者 AI 规则的交战距离设置为 的值rule_string。
set_npc_aim_rule: 字符串或变量对象	将 NPC 追随者 AI 规则的瞄准速度设置为 的值rule_string。
npc_die	对话结束后NPC就会死亡。
u_set_goal, npc_set_goal:assign_mission_target_object, (可选 true_eocs: eocs_array), (可选 false_eocs: eocs_array)	NPC将步行至assign_mission_target_object。有关参数，请参阅任务文档assign_mission_target。如果指定了目标，则运行中的所有effect_on_conditions ，否则运行true_eocs中的所有effect_on_conditions 。false_eocs
u_set_guard_pos,npc_set_guard_pos：变量对象，（可选 unique_id：布尔）	将 NPC 的守卫位置设置为 的内容_set_guard_pos。如果 NPC 具有该RETURN_TO_START_POS特征，那么当他们空闲时，他们会尝试移动到这个位置。如果unique_id（默认为 false）为 true，则 NPCunique_id将作为前缀添加到变量名称中。例如，带有unique_id=的守卫将检查以下 json 语句中的 GUARD1变量：GUARD1_First{ "u_set_guard_pos": { "global_val": "_First" }, "unique_id": true }
 */ 
