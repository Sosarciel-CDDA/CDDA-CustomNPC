"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEventEoc = exports.AnyEventTypeList = exports.GlobalEventTypeList = exports.CharEventTypeList = exports.InteractiveEventTypeList = void 0;
/**角色互动事件 列表 */
exports.InteractiveEventTypeList = [
    "MeleeAttackChar", //尝试近战攻击角色
    "MeleeAttackMons", //尝试近战攻击怪物
    "RangeAttackChar", //尝试远程攻击角色
    "RangeAttackMons", //尝试远程攻击怪物
    "MeleeAttack", //尝试近战攻击
    "RangeAttack", //尝试远程攻击
    "Attack", //尝试攻击
    "CauseMeleeHit", //近战攻击命中
    "MissMeleeHit", //近战攻击未命中
];
/**任何角色事件 列表*/
exports.CharEventTypeList = [
    ...exports.InteractiveEventTypeList, //
    "Update", //刷新
    "SlowUpdate", //60秒刷新
    "TakeDamage", //受到伤害
    "Death", //死亡
    "EnterBattle", //进入战斗
    "BattleUpdate", //进入战斗时 刷新
    "NonBattleUpdate", //非战斗时 刷新
];
/**全局事件列表 列表 */
exports.GlobalEventTypeList = [
    "AvaterMove", //玩家移动
    "AvaterUpdate", //玩家刷新
    "GameBegin", //每次进入游戏时
];
/**任何事件 列表 */
exports.AnyEventTypeList = [
    ...exports.GlobalEventTypeList,
    ...exports.CharEventTypeList,
];
function genEventEoc(prefix) {
    const eid = (id) => `${prefix}_${id}`;
    const rune = (id) => ({ run_eocs: eid(id) });
    const uvar = (id) => `u_${prefix}_${id}`;
    const nvar = (id) => `n_${prefix}_${id}`;
    const defObj = {
        base_setting: {
            eoc_type: "ACTIVATION"
        }
    };
    const eventMap = {
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
        MeleeAttackChar: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_melee_attacks_character"
            },
            invoke_effects: [rune("MeleeAttack")],
            link_events: ["MeleeAttack"]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "hits", bool },
            { "victim", character_id },
            { "victim_name", string },
            */
        },
        MeleeAttackMons: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_melee_attacks_monster"
            },
            invoke_effects: [rune("MeleeAttack")],
            link_events: ["MeleeAttack"]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "hits", bool },
            { "victim_type", mtype_id },
            */
        },
        MeleeAttack: {
            base_setting: {
                eoc_type: "ACTIVATION"
            },
            invoke_effects: [rune("Attack"), {
                    if: { math: ["_hits", "==", "1"] },
                    then: [rune("CauseMeleeHit")],
                    else: [rune("MissMeleeHit")],
                }],
            link_events: ["Attack", "MeleeAttackChar", "MeleeAttackMons", "CauseMeleeHit", "MissMeleeHit"]
        },
        CauseMeleeHit: {
            base_setting: defObj.base_setting,
            link_events: ["MeleeAttack"]
        },
        MissMeleeHit: {
            base_setting: defObj.base_setting,
            link_events: ["MeleeAttack"]
        },
        RangeAttackChar: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_ranged_attacks_character"
            },
            invoke_effects: [rune("RangeAttack")],
            link_events: ["RangeAttack"]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "victim", character_id },
            { "victim_name", string },
            */
        },
        RangeAttackMons: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_ranged_attacks_monster"
            },
            invoke_effects: [rune("RangeAttack")],
            link_events: ["RangeAttack"]
            /*
            { "attacker", character_id },
            { "weapon", itype_id },
            { "victim_type", mtype_id },
            */
        },
        RangeAttack: {
            base_setting: {
                eoc_type: "ACTIVATION"
            },
            invoke_effects: [rune("Attack")],
            link_events: ["Attack", "RangeAttack"]
        },
        Attack: {
            base_setting: defObj.base_setting,
            invoke_effects: [{
                    if: { math: [uvar("inBattle"), "<=", "0"] },
                    then: [rune("EnterBattle")],
                }, { math: [uvar("inBattle"), "=", "60"] }]
        },
        EnterBattle: defObj,
        BattleUpdate: defObj,
        NonBattleUpdate: defObj,
        Death: {
            base_setting: {
                eoc_type: "EVENT",
                required_event: "character_dies"
            }
            //{ "character", character_id },
        },
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
            invoke_effects: [{
                    if: { math: [uvar("inBattle"), ">", "0"] },
                    then: [rune("BattleUpdate"), { math: [uvar("inBattle"), "-=", "1"] }],
                    else: [rune("NonBattleUpdate")]
                }, {
                    if: { math: [uvar("slowCounter"), ">=", "60"] },
                    then: [rune("SlowUpdate"), { math: [uvar("slowCounter"), "=", "1"] }],
                    else: [{ math: [uvar("slowCounter"), "+=", "1"] }]
                }]
        },
        SlowUpdate: defObj,
        AvaterUpdate: {
            base_setting: {
                eoc_type: "RECURRING",
                recurrence: 1
            }
        }
    };
    const eocMap = {};
    for (const key in eventMap) {
        const fixkey = key;
        const event = eventMap[fixkey];
        eocMap[fixkey] = {
            type: "effect_on_condition",
            ...event.base_setting,
            id: `${prefix}_${key}_EVENT`
        };
    }
    return eocMap;
}
exports.genEventEoc = genEventEoc;
