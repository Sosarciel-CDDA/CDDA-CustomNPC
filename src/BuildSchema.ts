import { SchemaBuilder } from "cdda-schema";


export async function buildSchema(){
    const builder = new SchemaBuilder();
    await builder.builSchema("tsconfig.json","./schema");
}
