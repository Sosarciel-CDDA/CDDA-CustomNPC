import * as TJS from "typescript-json-schema";
import * as ts from "typescript";
import * as path from 'path';
import { resolve } from "path";
import { JObject, UtilFT, UtilFunc, stringifyJToken } from "@zwa73/utils";
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
const schemasPath = path.join(process.cwd(),"schema","schemas.json");
let schema = UtilFT.loadJSONFileSync(schemasPath) as any;
//替换SchemaString标识符
schema = JSON.parse(JSON.stringify(schema).replace(/\^\.\*SchemaString\$/g,'^.*$'));
UtilFT.writeJSONFile(schemasPath,schema);


/**忽略可用性检测的类型 */
const witoutType = ["AnyCddaJsonList","ImageInfoArr"];

const definitions = schema["definitions"] as Record<string,JObject>;
//展开定义
for(const typeName in definitions){
    const schema = definitions[typeName];
    //展开所有object与忽略检测的类型
    if(schema.type != "object" && schema.type != undefined && !witoutType.includes(typeName)) continue;
    if((/^.+_[0-9]/).test(typeName) || (/^{./).test(typeName)) continue;
    UtilFT.writeJSONFile(path.join(process.cwd(),"schema",`${typeName}.schema.json`),{
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$ref": `schemas.json#/definitions/${typeName}`
    });
}
