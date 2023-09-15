import { JArray } from "@zwa73/utils";
import { AnimType } from "./AnimTool";
import { CharData, DataManager } from "./DataManager";
import * as path from 'path';
import { EOC } from "./CddaJsonFormat/EOC";
import { genEOCID } from "./ModDefine";



function hasAnim(outData:Record<string,JArray>,animType:AnimType){
    return outData[path.join("anim",animType)]
}

/**移除其他动作变异 */
export function removeOtherAnimEoc(baseData:CharData,animType:AnimType){
    const otherAnim = baseData.vaildAnim.filter(item=> item!=animType);
    if(otherAnim.length<=0) return null;
    const eoc:EOC={
        type:"effect_on_condition",
        eoc_type: "ACTIVATION",
        id:genEOCID("RemoveOtherAnimEoc_"+animType),
        effect:[
            ...otherAnim.map(otherAnimType=>({
                    u_lose_trait:baseData.animData[otherAnimType].mutID
                }))
        ]
    }
    return eoc;
}

export function createAnimStatus(dm:DataManager,charName:string){
    const {baseData,outData} = dm.getCharData(charName);
    const eocList:EOC[] = [];
    //移动
    if(hasAnim(outData,"Move")){
        let removeEoc = removeOtherAnimEoc(baseData,"Move");
        if(removeEoc!=null)
            eocList.push(removeEoc);
    }
}