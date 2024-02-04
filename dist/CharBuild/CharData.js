"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharList = exports.getCharConfig = void 0;
const utils_1 = require("@zwa73/utils");
const path = require("path");
const fs = require("fs");
const CMDefine_1 = require("../CMDefine");
//处理角色配置文件
const CharList = [];
const CharConfigMap = {};
let count = 0;
//继承
function extendCharConfig(target, ...sources) {
    sources = [...sources.reverse(), target];
    let out = {};
    for (const obj of sources) {
        for (const key in obj) {
            if (key == "extends")
                continue;
            if (key == "virtual")
                continue;
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
/**获取角色配置文件 */
const getCharConfig = async (charName) => {
    if (CharConfigMap[charName] != null)
        return CharConfigMap[charName];
    count++;
    if (count > 1000)
        throw 'loadCharConfig 调用次数过多(>1000) 可能是循环继承';
    const charConfig = await utils_1.UtilFT.loadJSONFile(path.join((0, CMDefine_1.getCharPath)(charName), 'config'));
    if (charConfig.extends?.includes(charName))
        throw `${charName} 不应继承自身`;
    const exts = [];
    for (const char of charConfig.extends || [])
        exts.push(await (0, exports.getCharConfig)(char));
    CharConfigMap[charName] = extendCharConfig(charConfig, ...exts);
    return CharConfigMap[charName];
};
exports.getCharConfig = getCharConfig;
/**获取角色列表 */
const getCharList = async () => {
    if (CharList.length > 0)
        return CharList;
    let baseList = (await fs.promises.readdir(CMDefine_1.CHARS_PATH))
        .filter(fileName => fs.statSync(path.join(CMDefine_1.CHARS_PATH, fileName)).isDirectory());
    const filteredList = (await Promise.all(baseList.map(async (charName) => {
        const charConfig = await (0, exports.getCharConfig)(charName);
        if (charConfig.virtual !== true)
            return charName;
        return null;
    }))).filter((item) => item !== null);
    CharList.push(...filteredList);
    return CharList;
};
exports.getCharList = getCharList;
