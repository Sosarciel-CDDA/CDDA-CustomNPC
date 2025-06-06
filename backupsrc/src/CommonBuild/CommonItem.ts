import { CDataManager } from "@src/DataManager";
import { Armor, ArmorID } from "@sosarciel-cdda/schema";
import { genArmorMut } from "./UtilGener";




export async function createCommonItem(dm:CDataManager){
    //await AkasetGauntlet(dm);
}

//Akaset的手套
function AkasetGauntlet(dm:CDataManager){
    const glove:Armor={
        type:"ARMOR",
        id:"AkasetGauntlet" as ArmorID,
        name:{str_sp:"Akaset 的嗜冷生物处理手套"},
        "copy-from":"afs_freeze_gauntlet" as ArmorID,
        flags:["OUTER"]
    }
    const mut = genArmorMut(glove);
    dm.addStaticData([glove,mut],"common_resource","common_item","AkasetGauntlet");
}