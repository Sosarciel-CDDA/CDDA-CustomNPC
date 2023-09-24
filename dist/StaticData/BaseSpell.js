"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSpell = exports.ControlSpellFlags = exports.MELEE_RANGE = exports.BATTLE_RANGE = void 0;
const StaticData_1 = require("./StaticData");
const BaseMonster_1 = require("./BaseMonster");
const ModDefine_1 = require("../ModDefine");
/**n格以内算作进入战斗 */
exports.BATTLE_RANGE = 20;
/**n格以内酸作进入近战 */
exports.MELEE_RANGE = 3;
/**用于必定成功的控制法术的flags */
exports.ControlSpellFlags = ["SILENT", "NO_HANDS", "NO_LEGS", "NO_FAIL"];
exports.BaseSpell = [
    {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)("SummonSpellTarget"),
        name: "召唤法术标靶",
        description: "召唤法术标靶怪物",
        flags: ["HOSTILE_SUMMON", ...exports.ControlSpellFlags],
        valid_targets: ["ground"],
        min_damage: 1,
        max_damage: 1,
        min_aoe: 1,
        max_aoe: 1,
        effect: "summon",
        effect_str: BaseMonster_1.TARGET_MON_ID,
        min_duration: 1,
        max_duration: 1,
        shape: "blast",
    },
    {
        id: (0, ModDefine_1.genSpellID)("KillSpellTarget"),
        type: "SPELL",
        name: "清除法术标靶",
        description: "清除法术标靶",
        effect: "attack",
        shape: "blast",
        valid_targets: ["hostile"],
        flags: [...exports.ControlSpellFlags, "NO_EXPLOSION_SFX", "IGNORE_WALLS", "NON_MAGICAL"],
        min_damage: 100,
        max_damage: 100,
        damage_type: "pure",
        min_aoe: exports.BATTLE_RANGE,
        targeted_monster_ids: [BaseMonster_1.TARGET_MON_ID],
    },
    {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)("InitCurrHP"),
        name: "初始化当前生命值",
        description: "初始化当前生命值变量",
        flags: [...exports.ControlSpellFlags],
        valid_targets: ["hostile"],
        min_aoe: exports.BATTLE_RANGE,
        max_aoe: exports.BATTLE_RANGE,
        effect: "effect_on_condition",
        effect_str: "CNPC_EOC_InitCurrHP",
        shape: "blast",
    },
    {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)("CheckCurrHP_Range"),
        name: "检测当前生命值_远程",
        description: "检测战斗范围内的敌人当前生命值是否有变动",
        flags: [...exports.ControlSpellFlags],
        valid_targets: ["hostile"],
        min_aoe: exports.BATTLE_RANGE,
        max_aoe: exports.BATTLE_RANGE,
        effect: "effect_on_condition",
        effect_str: "CNPC_EOC_CheckCurrHP_Range",
        shape: "blast",
    },
    {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)("CheckCurrHP_Melee"),
        name: "检测当前生命值_近战",
        description: "检测近战范围内的敌人当前生命值是否有变动",
        flags: [...exports.ControlSpellFlags],
        valid_targets: ["hostile"],
        min_aoe: exports.MELEE_RANGE,
        max_aoe: exports.MELEE_RANGE,
        effect: "effect_on_condition",
        effect_str: "CNPC_EOC_CheckCurrHP_Melee",
        shape: "blast",
    },
    {
        id: (0, ModDefine_1.genSpellID)("TestConeSpell_DMG"),
        type: "SPELL",
        name: "测试用锥形法术 伤害部分",
        description: "测试用锥形法术 伤害部分",
        effect: "attack",
        shape: "cone",
        valid_targets: ["hostile", "ground"],
        min_damage: 100,
        max_damage: 100,
        min_aoe: 90,
        min_range: exports.BATTLE_RANGE,
        base_casting_time: 100,
        damage_type: "heat",
    },
    {
        id: (0, ModDefine_1.genSpellID)("TestConeSpell"),
        type: "SPELL",
        name: "测试用锥形法术",
        description: "测试用锥形法术",
        effect: "attack",
        shape: "cone",
        valid_targets: ["hostile"],
        flags: ["WONDER", "RANDOM_TARGET", ...exports.ControlSpellFlags],
        min_damage: 1,
        max_damage: 1,
        min_aoe: 90,
        min_range: exports.BATTLE_RANGE,
        base_casting_time: 100,
        extra_effects: [{ id: (0, ModDefine_1.genSpellID)("TestConeSpell_DMG") }],
        targeted_monster_ids: [BaseMonster_1.TARGET_MON_ID],
    },
    {
        type: "SPELL",
        id: (0, ModDefine_1.genSpellID)("SpawnBaseNpc"),
        name: "生成测试NPC",
        description: "生成测试NPC",
        flags: [...exports.ControlSpellFlags],
        valid_targets: ["self"],
        effect: "effect_on_condition",
        effect_str: "CNPC_EOC_SpawnBaseNpc",
        shape: "blast",
    }
];
(0, StaticData_1.saveStaticData)('BaseSpell', exports.BaseSpell);
