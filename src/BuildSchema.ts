import * as path from 'path';
import { UtilFunc } from "@zwa73/utils";
import { expandSchema } from "cdda-schema";


async function main(){
    const log = await UtilFunc.exec(`typescript-json-schema tsconfig.json * --out schema/schemas.json --required --strictNullChecks --aliasRefs`);
    console.log(log);
    await expandSchema(path.join(process.cwd(),"schema","schemas.json"),["ImageInfoArr"])
}
main()
