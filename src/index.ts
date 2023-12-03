import { DataManager } from "./DataManager";
import { UtilFT, UtilFunc } from "@zwa73/utils";
import { StaticDataMap } from "./StaticData";
import { createAnimStatus, createAnimTool, createCharCarry, createCharClass, createCharEquip, createCharSkill, createCharTalkTopic, mergeAnime } from "./CharBuild";
import { commonBuild } from "./CommonBuild";
import { createDivinationSpell } from "./CommonBuild/DivinationSpell";
import { createDrawCardSpell } from "./CommonBuild/DrawCardSpell";
import { mergeImage } from "./CharBuild/MergeImage";



export async function buildChar(dm:DataManager,charName:string){
    UtilFT.ensurePathExists(dm.getOutCharPath(charName),true);
    await mergeImage(dm,charName);
    await mergeAnime(dm,charName,false);
    await createAnimTool(dm,charName);
    await createCharClass(dm,charName);
    await createCharEquip(dm,charName);
    await createCharCarry(dm,charName);
    await createAnimStatus(dm,charName);
    await createCharSkill(dm,charName);
    await createCharTalkTopic(dm,charName);
}



export async function main(){
    const dm = await DataManager.create();

    await commonBuild(dm);
    const plist:Promise<void>[] = []
    for(let charName of dm.charList)
        plist.push(buildChar(dm,charName));
    await Promise.all(plist);
    await dm.saveAllData();
}



main();
