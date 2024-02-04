"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnchStatTable = void 0;
function parseMath(obj) {
    if (obj === undefined)
        return undefined;
    if (typeof obj === "number")
        return { math: [`${obj}`] };
    if ("math" in obj)
        return { math: [obj.math[0]] };
    throw `属性仅支持 number 或 math表达式 无效的附魔属性:${obj}`;
}
/**解析变量属性表 */
function parseEnchStatTable(table) {
    if (table == null)
        return [];
    let out = [];
    for (const key in table) {
        const field = key;
        const { add, multiply } = table[field];
        out.push({
            value: field,
            add: parseMath(add),
            multiply: parseMath(multiply)
        });
    }
    return out;
}
exports.parseEnchStatTable = parseEnchStatTable;
