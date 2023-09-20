import * as TJS from "typescript-json-schema";
import * as ts from "typescript";
import * as path from 'path';
import { resolve } from "path";
import { JObject, UtilFT } from "@zwa73/utils";
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

const schema = UtilFT.loadJSONFileSync(path.join(process.cwd(),"schema","schemas")) as any;
const definitions = schema["definitions"] as Record<string,JObject>;

for(const typeName in definitions){
    const schema = definitions[typeName];
    if(schema.type != "object") continue;
    UtilFT.writeJSONFile(path.join(process.cwd(),"schema",`${typeName}.schema.json`),{
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$ref": `schemas.json#/definitions/${typeName}`
    });
}
