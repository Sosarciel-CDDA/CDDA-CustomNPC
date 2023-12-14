"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
const EventInterface_1 = require("./EventInterface");
class EventManager {
    _hookMap;
    _effectsMap = {};
    _prefix;
    constructor(prefix) {
        this._hookMap = (0, EventInterface_1.genDefineHookMap)(prefix);
        this._prefix = prefix;
    }
    /**导出 */
    build() {
        const json = [];
        //加入effect
        for (const key in this._hookMap) {
            const fixkey = key;
            const hookObj = this._hookMap[fixkey];
            //加入effect
            let elist = this._effectsMap[fixkey] || [];
            elist.sort((a, b) => b.weight - a.weight);
            const eventeffects = [];
            elist.forEach((e) => eventeffects.push(...e.effects));
            const eoc = {
                type: "effect_on_condition",
                ...hookObj.base_setting,
                id: `${this._prefix}_${key}_EVENT`,
                effect: [...hookObj.before_effects ?? [], ...eventeffects, ...hookObj.after_effects ?? []]
            };
            //整合eoc数组
            json.push(eoc);
        }
        return json;
    }
    /**添加事件 */
    addEvent(hook, weight, effects) {
        this.verifyHook(hook);
        this._effectsMap[hook] = this._effectsMap[hook] ?? [];
        const list = this._effectsMap[hook];
        list?.push({ effects, weight });
    }
    /**添加调用eoc事件 */
    addInvoke(hook, weight, ...eocids) {
        this.verifyHook(hook);
        this._effectsMap[hook] = this._effectsMap[hook] ?? [];
        const list = this._effectsMap[hook];
        list?.push({ effects: [{ run_eocs: eocids }], weight });
    }
    /**添加自定义的Hook */
    addHook(hook, eoc) {
        this._hookMap[hook] = eoc;
    }
    /**验证hook是否存在 */
    verifyHook(hook) {
        if (this._hookMap[hook] == null)
            throw `hook:${hook} 不存在`;
    }
}
exports.EventManager = EventManager;
