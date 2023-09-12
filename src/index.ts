import * as path from "path";
import * as fs from "fs";
import { CHAR_LIST, getCharPath } from "./Data";
import { mergeImage } from "./MergeImage";
import { Mutation } from "./CddaJsonFormat/Mutattion";
import { createAnimTool } from "./AnimTool";
import { createCharClass } from "./CharClass";


export async function build(charName:string){
    const charPath = getCharPath(charName);
    await mergeImage(charName);
    await createAnimTool(charName);
    await createCharClass(charName);

}


for(let charName of CHAR_LIST){
    build(charName);
}


export * from "./StaticData";
export * from "./CddaJsonFormat";
