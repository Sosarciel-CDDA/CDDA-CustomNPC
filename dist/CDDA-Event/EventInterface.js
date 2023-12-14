"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genDefineHookMap = exports.AnyEventTypeList = exports.GlobalHookList = exports.CharHookList = exports.InteractHookList = void 0;
//Interactive
/**角色互动事件 列表 */
exports.InteractHookList = [
    "TryMeleeAtkChar", //尝试近战攻击角色
    "TryMeleeAtkMon", //尝试近战攻击怪物
    "TryRangeAtkChar", //尝试远程攻击角色
    "TryRangeAtkMon", //尝试远程攻击怪物
    "TryMeleeAttack", //尝试近战攻击
    "TryRangeAttack", //尝试远程攻击
    "TryAttack", //尝试攻击
    "SucessMeleeAttack", //近战攻击命中
    "MissMeleeAttack", //近战攻击未命中
];
/**任何角色事件 列表*/
exports.CharHookList = [
    ...exports.InteractHookList, //
    "Init", //初始化
    "Update", //刷新
    "SlowUpdate", //60秒刷新
    "TakeDamage", //受到伤害
    "DeathPrev", //死亡
    "Death", //死亡
    "EnterBattle", //进入战斗
    "BattleUpdate", //进入战斗时 刷新
    "NonBattleUpdate", //非战斗时 刷新
];
/**全局事件列表 列表 */
exports.GlobalHookList = [
    "AvaterMove", //玩家移动
    "AvaterUpdate", //玩家刷新
    "GameBegin", //每次进入游戏时
];
/**任何事件 列表 */
exports.AnyEventTypeList = [
    ...exports.GlobalHookList,
    ...exports.CharHookList,
];
function genDefineHookMap(prefix) {
    const eid = (id) => `${prefix}_${id}_EVENT`;
    const rune = (id) => ({ run_eocs: eid(id) });
    const uvar = (id) => `u_${prefix}_${id}`;
    const nvar = (id) => `n_${prefix}_${id}`;
    //默认Hook
    const defObj = {
        base_setting: {
            eoc_type: "ACTIVATION"
        }
    };
    //预定义的Hook
    const hookMap = {
        GameBegin: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "game_begin"
            }
        },
        TakeDamage: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_takes_damage"
            }
            /*
            { "character", character_id }
            { "damage", int }
            */
        },
        TryMeleeAtkChar: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_melee_attacks_character"
            },
            after_effects: [rune("TryMeleeAttack")]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "hits", bool },
            { "victim", character_id },
            { "victim_name", string },
            */
        },
        TryMeleeAtkMon: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_melee_attacks_monster"
            },
            after_effects: [rune("TryMeleeAttack")]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "hits", bool },
            { "victim_type", mtype_id },
            */
        },
        TryMeleeAttack: {
            base_setting: {
                eoc_type: "ACTIVATION"
            },
            after_effects: [rune("TryAttack"), {
                    if: { math: ["_hits", "==", "1"] },
                    then: [rune("SucessMeleeAttack")],
                    else: [rune("MissMeleeAttack")],
                }]
        },
        SucessMeleeAttack: {
            base_setting: defObj.base_setting
        },
        MissMeleeAttack: {
            base_setting: defObj.base_setting
        },
        TryRangeAtkChar: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_ranged_attacks_character"
            },
            after_effects: [rune("TryRangeAttack")]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "victim", character_id },
            { "victim_name", string },
            */
        },
        TryRangeAtkMon: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_ranged_attacks_monster"
            },
            after_effects: [rune("TryRangeAttack")]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "victim_type", mtype_id },
            */
        },
        TryRangeAttack: {
            base_setting: {
                eoc_type: "ACTIVATION"
            },
            after_effects: [rune("TryAttack")]
        },
        TryAttack: {
            base_setting: defObj.base_setting,
            after_effects: [{
                    if: { math: [uvar("inBattle"), "<=", "0"] },
                    then: [rune("EnterBattle")],
                }, { math: [uvar("inBattle"), "=", "60"] }]
        },
        EnterBattle: defObj,
        BattleUpdate: defObj,
        NonBattleUpdate: defObj,
        DeathPrev: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_dies"
            },
            after_effects: [{
                    if: { or: [{ math: ["u_hp('head')", "<=", "0"] }, { math: ["u_hp('torso')", "<=", "0"] }] },
                    then: [rune("Death")],
                    else: ["u_prevent_death"]
                }]
            //{ "character", character_id },
        },
        Death: defObj,
        AvaterMove: {
            base_setting: {
                eoc_type: "OM_MOVE"
            }
        },
        Update: {
            base_setting: {
                eoc_type: "RECURRING",
                recurrence: 1,
                global: true,
                run_for_npcs: true
            },
            before_effects: [{
                    if: { math: [uvar("isInit"), "!=", "1"] },
                    then: [rune("Init"), { math: [uvar("isInit"), "=", "1"] }]
                }],
            after_effects: [{
                    if: { math: [uvar("inBattle"), ">", "0"] },
                    then: [rune("BattleUpdate"), { math: [uvar("inBattle"), "-=", "1"] }],
                    else: [rune("NonBattleUpdate")]
                }, {
                    if: { math: [uvar("slowCounter"), ">=", "60"] },
                    then: [rune("SlowUpdate"), { math: [uvar("slowCounter"), "=", "1"] }],
                    else: [{ math: [uvar("slowCounter"), "+=", "1"] }]
                }]
        },
        Init: defObj,
        SlowUpdate: defObj,
        AvaterUpdate: {
            base_setting: {
                eoc_type: "RECURRING",
                recurrence: 1
            }
        }
    };
    return hookMap;
}
exports.genDefineHookMap = genDefineHookMap;
