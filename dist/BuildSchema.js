"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const utils_1 = require("@zwa73/utils");
const cdda_schema_1 = require("cdda-schema");
async function main() {
    const log = await utils_1.UtilFunc.exec(`typescript-json-schema tsconfig.json * --out schema/schemas.json --required --strictNullChecks --aliasRefs`);
    console.log(log);
    await (0, cdda_schema_1.expandSchema)(path.join(process.cwd(), "schema", "schemas.json"), ["ImageInfoArr"]);
}
main();
