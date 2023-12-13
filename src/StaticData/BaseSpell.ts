import { JArray } from "@zwa73/utils";
import { saveStaticData } from "./StaticData";
import { TARGET_MON_ID } from "./BaseMonster";
import { genSpellID } from "@src/ModDefine";
import { Spell } from "cdda-schema";


/**n格以内算作进入战斗/远程攻击范围 */
export const BATTLE_RANGE = 30;
/**n格以内算作进入近战 */
export const MELEE_RANGE = 3;
/**最大法术伤害 */
export const SPELL_MAX_DAMAGE = 10000000;
/**施法后摇法术ID */
export const SPELL_CT_MODMOVE = genSpellID(`CastTimeModMove`);
/**施法后摇变量 */
export const SPELL_CT_MODMOVE_VAR = 'casttime_modmove';
/**加速一回合 */
export const SPELL_M1T = genSpellID("Mod1Turn");

/**用于必定成功的控制法术的flags */
export const CON_SPELL_FLAG = ["SILENT", "NO_HANDS", "NO_LEGS", "NO_FAIL","NO_EXPLOSION_SFX"] as const;
export const BaseSpell:Spell[] = [
    {
        type: "SPELL",
        id: genSpellID("SummonSpellTarget"),
        name: "召唤法术标靶",
        description: "召唤法术标靶怪物",
        flags: ["HOSTILE_SUMMON",...CON_SPELL_FLAG],
        valid_targets: ["ground"],
        min_damage: 1,
        max_damage: 1,
        min_aoe: 1,
        max_aoe: 1,
        effect: "summon",
        effect_str: TARGET_MON_ID,
        min_duration: 1,
        max_duration: 1,
        shape: "blast",
    },
    /*{
        type: "SPELL",
        id: genSpellID("TeleportSpellTarget"),
        name: "传送法术标靶",
        description: "将附近法术标靶传送到自身位置",
        flags: [...CON_SPELL_FLAG],
        valid_targets: ["hostile","ally"],
        min_aoe: 1,
        max_aoe: 1,
        effect: "effect_on_condition",
        effect_str: "CNPC_EOC_TeleportSpellTarget",
        shape: "blast",
        targeted_monster_ids: [TARGET_MON_ID],
    },*/
    {
        id: genSpellID("KillSpellTarget"),
        type: "SPELL",
        name: "清除法术标靶",
        description: "清除法术标靶",
        effect: "effect_on_condition",
        effect_str: "CNPC_EOC_KillSpellTarget",
        shape: "blast",
        valid_targets: ["hostile"],
        flags: [...CON_SPELL_FLAG,"IGNORE_WALLS"],
        min_aoe: BATTLE_RANGE,
        targeted_monster_ids: [TARGET_MON_ID],
    },
    {
        id: genSpellID("DeathStunned"),
        type: "SPELL",
        name: "死亡眩晕",
        description: "死亡时将周围怪物眩晕",
        effect: "attack",
        effect_str: "stunned",
        shape: "blast",
        valid_targets: ["hostile"],
        flags: [...CON_SPELL_FLAG],
        min_aoe: 1,
        min_duration: 100,
        max_duration: 100,
    },
    {
        id: SPELL_M1T,
        type: "SPELL",
        name: "加速一回合",
        description: "获得一回合移动调整",
        effect: "mod_moves",
        shape: "blast",
        valid_targets: ["self"],
        flags: [...CON_SPELL_FLAG],
        min_damage:100,
        max_damage:100
    },
    {
        type: "SPELL",
        id: genSpellID("InitCurrHP"),
        name: "初始化当前生命值",
        description: "初始化当前生命值变量",
        flags: [...CON_SPELL_FLAG],
        valid_targets: ["hostile"],
        min_aoe: BATTLE_RANGE,
        max_aoe: BATTLE_RANGE,
        effect: "effect_on_condition",
        effect_str: "CNPC_EOC_InitCurrHP",
        shape: "blast",
    },
    {
        type: "SPELL",
        id: genSpellID("CheckCurrHP_Range"),
        name: "检测当前生命值_远程",
        description: "检测战斗范围内的敌人当前生命值是否有变动",
        flags: [...CON_SPELL_FLAG],
        valid_targets: ["hostile"],
        min_aoe: BATTLE_RANGE,
        max_aoe: BATTLE_RANGE,
        effect: "effect_on_condition",
        effect_str: "CNPC_EOC_CheckCurrHP_Range",
        shape: "blast",
    },
    {
        type: "SPELL",
        id: genSpellID("CheckCurrHP_Melee"),
        name: "检测当前生命值_近战",
        description: "检测近战范围内的敌人当前生命值是否有变动",
        flags: [...CON_SPELL_FLAG],
        valid_targets: ["hostile"],
        min_aoe: MELEE_RANGE,
        max_aoe: MELEE_RANGE,
        effect: "effect_on_condition",
        effect_str: "CNPC_EOC_CheckCurrHP_Melee",
        shape: "blast",
    },
    {
        id: genSpellID("TestConeSpell_DMG"),
        type: "SPELL",
        name: "测试用锥形法术 伤害部分",
        description: "测试用锥形法术 伤害部分",
        effect: "attack",
        shape: "cone",
        valid_targets: ["hostile", "ground"],
        min_damage: 100,
        max_damage: 100,
        min_aoe: 90,
        min_range: BATTLE_RANGE,
        base_casting_time: 100,
        damage_type: "heat",
    },
    {
        id: genSpellID("TestConeSpell"),
        type: "SPELL",
        name: "测试用锥形法术",
        description: "测试用锥形法术",
        effect: "attack",
        shape: "cone",
        valid_targets: ["hostile"],
        flags: ["WONDER", "RANDOM_TARGET",...CON_SPELL_FLAG],
        min_damage: 1,
        max_damage: 1,
        min_aoe: 90,
        min_range: BATTLE_RANGE,
        base_casting_time: 100,
        extra_effects: [{ id: genSpellID("TestConeSpell_DMG") }],
        targeted_monster_ids: [TARGET_MON_ID],
    },
    {
        id: SPELL_CT_MODMOVE,
        type: "SPELL",
        name: "施法后摇",
        description: "施法后摇",
        effect: "mod_moves",
        shape: "blast",
        valid_targets: ["self"],
        flags: [...CON_SPELL_FLAG],
        min_damage: {math:[`0-${SPELL_CT_MODMOVE_VAR}`]},
        max_damage: SPELL_MAX_DAMAGE,
    },
];


saveStaticData(BaseSpell,'static_resource','base_spell');