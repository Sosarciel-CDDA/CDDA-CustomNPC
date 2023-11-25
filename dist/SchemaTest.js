"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericFlagList = void 0;
const TJS = require("typescript-json-schema");
const path = require("path");
const settings = {
    required: true,
    strictNullChecks: true,
    ignoreErrors: true,
    constAsEnum: true,
};
// optionally pass ts compiler options
const compilerOptions = {
    required: true,
    strictNullChecks: true,
    ignoreErrors: true,
    preserveConstEnums: true,
    constAsEnum: true,
};
const basePath = path.join(process.cwd(), "src", "SchemaTest.ts");
// 你的TypeScript程序
const program = TJS.getProgramFromFiles([basePath], compilerOptions);
// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, "*", settings);
console.log(JSON.stringify(schema, null, 2));
/**通用物品的flag列表 */
exports.GenericFlagList = [
    "ACTIVATE_ON_PLACE",
    "SINGLE_USE",
    "ZERO_WEIGHT",
    "TARDIS",
    "TRADER_KEEP",
    "NO_RELOAD",
    "UNBREAKABLE",
    "DURABLE_MELEE", // 坚固的近战武器
];
