"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSchema = void 0;
const cdda_schema_1 = require("cdda-schema");
async function buildSchema() {
    const builder = new cdda_schema_1.SchemaBuilder();
    await builder.builSchema("tsconfig.json", "./schema");
}
exports.buildSchema = buildSchema;
