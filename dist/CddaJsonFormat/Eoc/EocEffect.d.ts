import { FakeSpell } from "../Enchantment";
import { AnyItemID } from "../Item";
import { MutationID } from "../Mutattion";
import { NpcInstanceID } from "../NpcInstance";
import { SoundEffectID, SoundEffectVariantID } from "../SoundEffect";
import { EocID, InlineEoc, TalkerVar } from "./Eoc";
import { LocObj, NumObj, StrObj } from "./VariableObject";
import { EffectID } from "../Effect";
import { BodyPartParam, Time } from "../GenericDefine";
/**Eoc效果 */
export type EocEffect = EocEffectList[number];
/**Eoc效果表 */
export type EocEffectList = [
    {
        math: [string, "=" | "+=" | "-=" | "*=" | "/=", string];
    },
    {
        u_lose_trait: MutationID;
    },
    RunEoc,
    QueueEoc,
    RunEocWith,
    {
        u_add_trait: MutationID;
    },
    {
        u_consume_item: AnyItemID;
        count: number;
    },
    "drop_weapon",
    SpawnNpc,
    {
        u_spawn_item: AnyItemID;
    },
    "follow_only",
    "leave",
    SoundEffect,
    CastSpell,
    Teleport,
    LocalVar,
    Message,
    AddEffect,
    SetHP
];
/**运行Eoc */
type RunEoc = {
    /**运行Eoc */
    run_eocs: ParamsEoc;
};
/**延迟队列eoc */
type QueueEoc = {
    /**运行Eoc 将会丢失beta talker*/
    queue_eocs: ParamsEoc;
    /**延迟 */
    time_in_future: Time;
};
/**运行Eoc 并提供参数 */
type RunEocWith = {
    run_eoc_with: ParamsEoc;
    /**提供的上下文参数表 变量名:值 */
    variables?: Record<string, string>;
    /**将loc所在位置的单位作为beta talker */
    beta_loc?: LocObj;
};
/**生成Npc */
type SpawnNpc = TalkerVar<{
    /**Npc实例ID */
    spawn_npc: NpcInstanceID;
    /**真实数量 */
    real_count?: number;
    /**最小半径 */
    min_radius?: number;
    /**最大半径 */
    max_radius?: number;
}, "spawn_npc">;
/**播放声音 */
type SoundEffect = {
    /**音效ID */
    id: StrObj | SoundEffectID;
    /**变体ID */
    sound_effect?: StrObj | SoundEffectVariantID;
    /**如果为true则如果玩家在 地下/地下室 时难以听到 */
    outdoor_event?: boolean;
    /**音量 */
    volume: NumObj;
};
/**施法 */
type CastSpell = TalkerVar<{
    /**施法 */
    cast_spell: FakeSpell;
    /**默认为 false；如果为 true, 则允许您瞄准施放的法术,
     * 否则将其施放于随机位置, 就像RANDOM_TARGET使用了法术标志一样
     * RANDOM_TARGET法术需要此项目为true才能正常索敌
     */
    targeted?: boolean;
    /**成功施法后运行的eoc */
    true_eocs?: ParamsEoc;
    /**施法失败后运行的eoc */
    false_eocs?: ParamsEoc;
}, "cast_spell">;
/**传送 */
type Teleport = TalkerVar<{
    teleport: LocObj;
    /**成功传送产生的消息 */
    success_message?: StrObj;
    /**传送失败产生的消息 */
    fail_message?: StrObj;
    /**强制传送 尽可能传送到目标位置 传送不会失败 */
    force?: boolean;
}, "teleport">;
/**搜索并获取坐标 存入location_variable*/
type LocalVar = TalkerVar<{
    location_variable: LocObj;
    /**在发起者周围 的最小半径 默认 0 */
    min_radius?: NumObj;
    /**在发起者周围 的最大半径 默认 0 */
    max_radius?: NumObj;
    /**如果为 true, 则仅选择室外值 默认为 false */
    outdoor_only?: boolean;
    /**如果使用, 搜索将不是从u_或npc_位置执行,
     * 而是从 执行mission_target。
     * 它使用allocate_mission_target语法
     */
    target_params?: MissionTarget;
    /**将结果的x值增加 */
    x_adjust?: NumObj;
    /**将结果的y值增加 */
    y_adjust?: NumObj;
    /**将结果的z值增加 */
    z_adjust?: NumObj;
    /**如果为 true, 则不将其累加到z级别,
     * 而是用绝对值覆盖它:"z_adjust": 3将"z_override": true的值z转为3
     * 默认为 false
     */
    z_override?: boolean;
    /**搜索的目标地形 空字符串为任意 */
    terrain?: StrObj;
    /**搜索的目标家具 空字符串为任意 */
    furniture?: StrObj;
    /**搜索的目标陷阱 空字符串为任意 */
    trap?: StrObj;
    /**搜索的目标怪物 空字符串为任意 */
    monster?: StrObj;
    /**搜索的目标区域 空字符串为任意 */
    zone?: StrObj;
    /**搜索的目标NPC 空字符串为任意 */
    npc?: StrObj;
    /**在搜索目标周围的最小半径 */
    target_min_radius?: NumObj;
    /**在搜索目标周围的最大半径 */
    target_max_radius?: NumObj;
}, "location_variable">;
/**发送消息 */
type Message = TalkerVar<{
    message: string;
    /**默认中立；消息如何在日志中显示（通常是指颜色）；
     * 可以是良好（绿色）、中性（白色）、不良（红色）、
     * 混合（紫色）、警告（黄色）、信息（蓝色）、调试（仅在调试模式打开时出现）、
     * 爆头（紫色）、临界（黄色）, 放牧（蓝色）
     */
    type?: 'good' | 'neutral' | 'bad' | 'mixed' | 'warning' | 'info' | 'debug' | 'headshot' | 'critical' | 'grazing';
    /**如果为true 那么只会在用户没有聋时显示 */
    sound?: boolean;
    /**如果为true 且 sound为真 玩家在 地下/地下室 时难以听到 */
    outdoor_only?: boolean;
    /**如果为 true, 则效果会显示来自的随机片段u_message */
    snippet?: boolean;
    /**如果为 true, 并且snippet为 true, 它将连接讲话者和片段,
     * 并且如果该讲话者使用的话, 将始终提供相同的片段；要求片段设置 id
     */
    same_snippet?: boolean;
    /**如果为真, 该消息将生成一个弹出窗口u_message */
    popup?: boolean;
    /**如果为 true, 并且popup为 true, 则弹出窗口将中断任何发送消息的活动 */
    popup_w_interrupt_query?: boolean;
    /**默认为“中性”；distraction_type, 用于中断, 用于分心管理器
     * 完整列表存在 inactivity_type.cpp
     */
    interrupt_type?: boolean;
}, "message">;
/**添加效果 */
type AddEffect = TalkerVar<{
    add_effect: EffectID;
    /**添加的时间 默认 0 */
    duration?: Time;
    /**默认为 whole body 全身 */
    target_part?: BodyPartParam;
    /**效果强度 默认 0 */
    intensity?: NumObj;
    /**是否强制添加忽略豁免 默认 false */
    force?: boolean;
}, "add_effect">;
/**设置生命 */
type SetHP = TalkerVar<{
    set_hp: NumObj;
    /**默认为 whole body 全身
     * 如果使用, HP调整将仅应用于该身体部位
     */
    target_part?: BodyPartParam;
    /**仅增加 默认false
     * 如果属实, HP只能增加
     */
    only_increase?: boolean;
    /**只影响主要肢体 默认 false */
    main_only?: boolean;
    /**只影响次要肢体 默认 false */
    minor_only?: boolean;
    /**忽略数值 设置为满值 默认 false */
    max?: boolean;
}, "set_hp">;
/**参数Eoc */
export type ParamsEoc = (EocID | StrObj | InlineEoc) | (EocID | StrObj | InlineEoc)[];
/**分配任务目标 assign_mission_target
 * MISSIONS_JSON.md
 */
export type MissionTarget = null;
export {};
