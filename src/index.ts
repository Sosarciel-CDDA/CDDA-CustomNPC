import { DataManager } from "./DataManager";
import { mergeImage } from "./MergeImage";
import { createCharClass } from "./CharClass";
import { createAnimTool } from "./AnimTool";
import { createCharEquip } from "./CharEquip";
import { createAnimStatus } from "./AnimStatus";
import { UtilFT } from "@zwa73/utils";



export async function buildChar(dm:DataManager,charName:string){
    UtilFT.ensurePathExists(dm.getOutCharPath(charName),true);
    await mergeImage(dm,charName);
    await createAnimTool(dm,charName);
    await createCharClass(dm,charName);
    await createCharEquip(dm,charName);
    await createAnimStatus(dm,charName);
}




export async function main(){
    const dm = new DataManager();
    const plist:Promise<void>[] = []
    for(let charName of dm.charList)
        plist.push(buildChar(dm,charName));
    await Promise.all(plist);
    dm.saveAllData();
}



main();


export * from "./StaticData";
export * from "./CddaJsonFormat";
export * from './ModDefine';
