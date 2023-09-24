"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const utils_1 = require("@zwa73/utils");
/**
// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
    required: true,
    aliasRef: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
};

//const basePath = path.join(process.cwd(),"src");
//const fillPathList = Object.values(UtilFT.fileSearch(basePath,"\\.ts$"))
//    .filter(filePath=>!filePath.includes("StaticData"));
//console.log("files",fillPathList);

// 你的TypeScript程序
const program = TJS.getProgramFromFiles(
    [path.join(process.cwd(),"tsconfig.json")],
    compilerOptions
);

// We can either get the schema for one file and one type...
const schema = TJS.generateSchema(program, "*", settings);

UtilFT.writeJSONFile(path.join(process.cwd(),"schemas"),schema as any);
*/
const schemasPath = path.join(process.cwd(), "schema", "schemas.json");
let schema = utils_1.UtilFT.loadJSONFileSync(schemasPath);
//替换SchemaString标识符
schema = JSON.parse(JSON.stringify(schema).replace(/\^\.\*SchemaString\$/g, '^.*$'));
utils_1.UtilFT.writeJSONFile(schemasPath, schema);
/**忽略可用性检测的类型 */
const witoutType = ["AnyCddaJsonList", "ImageInfoArr"];
const definitions = schema["definitions"];
//展开定义
for (const typeName in definitions) {
    const schema = definitions[typeName];
    //展开所有object与忽略检测的类型
    if (schema.type != "object" && !witoutType.includes(typeName))
        continue;
    utils_1.UtilFT.writeJSONFile(path.join(process.cwd(), "schema", `${typeName}.schema.json`), {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$ref": `schemas.json#/definitions/${typeName}`
    });
}
