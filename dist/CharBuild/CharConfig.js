"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCharConfig = exports.getTalkerFieldVarID = exports.getGlobalFieldVarID = exports.parseEnchStatTable = exports.parseEnchStat = void 0;
const path = require("path");
const utils_1 = require("@zwa73/utils");
/**解析变量属性Obj */
function parseEnchStat(stat) {
    let match = stat.match(/(add|multiply)_(.*)/);
    if (match == null)
        throw `parseEnchStat 传入了一个错误值 ${stat}`;
    return {
        category: match[1],
        field: match[2]
    };
}
exports.parseEnchStat = parseEnchStat;
/**解析变量属性表 */
function parseEnchStatTable(table) {
    if (table == null)
        return [];
    let out = [];
    for (const key in table) {
        const enchStat = key;
        const value = table[enchStat];
        let parseObj = parseEnchStat(enchStat);
        const { category, field } = parseObj;
        let modstr = "0";
        if (typeof value == "number")
            modstr = value + "";
        else if ("math" in value)
            modstr = value.math[0];
        else
            throw `附魔属性仅支持 number 或 math表达式 无效的附魔属性:${value}`;
        out.push({
            value: field,
            [category]: { math: [modstr] }
        });
    }
    return out;
}
exports.parseEnchStatTable = parseEnchStatTable;
/**获取全局的强化字段的变量ID */
function getGlobalFieldVarID(charName, field) {
    return `${charName}_${field}`;
}
exports.getGlobalFieldVarID = getGlobalFieldVarID;
function getTalkerFieldVarID(talker, field) {
    return `${talker}_${field}`;
}
exports.getTalkerFieldVarID = getTalkerFieldVarID;
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
            if (key == "extends")
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
