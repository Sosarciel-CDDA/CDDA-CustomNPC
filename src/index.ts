import * as path from "path";
import * as fs from "fs";
import { CHAR_LIST, getCharPath } from "./DataManager";
import { mergeImage } from "./MergeImage";
import { Mutation } from "./CddaJsonFormat/Mutattion";
import { createAnimTool } from "./AnimTool";
import { createCharClass } from "./CharClass";
import { outStaticData } from "./StaticData";


export async function buildChar(charName:string){
    const charPath = getCharPath(charName);
    await mergeImage(charName);
    await createAnimTool(charName);
    await createCharClass(charName);

}

export async function main(){
    await outStaticData();
    for(let charName of CHAR_LIST)
        buildChar(charName);
}
main();


export * from "./StaticData";
export * from "./CddaJsonFormat";
