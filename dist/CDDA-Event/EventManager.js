"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
const utils_1 = require("@zwa73/utils");
const EventInterface_1 = require("./EventInterface");
class EventManager {
    _eocMap;
    _effectsMap = {};
    constructor(prefix) {
        this._eocMap = (0, EventInterface_1.genEventEoc)(prefix);
    }
    /**导出 */
    build() {
        const json = [];
        //加入effect
        const eocmap = utils_1.UtilFunc.deepClone(this._eocMap);
        for (const key in eocmap) {
            const fixkey = key;
            const eoc = eocmap[fixkey];
            //加入effect
            eoc.effect = eoc.effect ?? [];
            let elist = this._effectsMap[fixkey] || [];
            elist.sort((a, b) => b.weight - a.weight);
            const eventeffects = [];
            elist.forEach((e) => eventeffects.push(...e.effects));
            eoc.effect.push(...eventeffects);
            //整合eoc数组
            json.push(eoc);
        }
        return json;
    }
    /**添加事件 */
    addEvent(etype, weight, effects) {
        this._effectsMap[etype] = this._effectsMap[etype] ?? [];
        const list = this._effectsMap[etype];
        list?.push({ effects, weight });
    }
    /**添加调用eoc事件 */
    addInvoke(etype, weight, ...eocids) {
        this._effectsMap[etype] = this._effectsMap[etype] ?? [];
        const list = this._effectsMap[etype];
        list?.push({ effects: [{ run_eocs: eocids }], weight });
    }
}
exports.EventManager = EventManager;
