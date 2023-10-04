"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCharConfig = void 0;
const path = require("path");
const utils_1 = require("@zwa73/utils");
let count = 0;
/**读取某个角色的CharConfig */
async function loadCharConfig(dm, charName) {
    count++;
    if (count > 1000)
        throw 'loadCharConfig 调用次数过多(>1000) 可能是循环继承';
    const charConfig = await utils_1.UtilFT.loadJSONFile(path.join(dm.getCharPath(charName), 'config'));
    if (charConfig.extends?.includes(charName))
        throw `${charName} 不应继承自身`;
    const exts = [];
    for (const char of charConfig.extends || [])
        exts.push((await dm.getCharData(char)).charConfig);
    return extendCharConfig(charConfig, ...exts);
}
exports.loadCharConfig = loadCharConfig;
//继承
function extendCharConfig(target, ...sources) {
    sources = [...sources.reverse(), target];
    let out = {};
    for (const obj of sources) {
        for (const key in obj) {
            const value = obj[key];
            if (Array.isArray(value)) {
                out[key] = out[key] == null
                    ? value
                    : [...out[key], ...value];
            }
            else if (typeof value == "object") {
                out[key] = out[key] == null
                    ? value
                    : Object.assign({}, out[key], value);
            }
            else
                out[key] = value;
        }
    }
    return out;
}
