import { JArray } from "@zwa73/utils";
import { AnimType } from "./AnimTool";
import { CharDefineData, DataManager } from "../DataManager";
import * as path from 'path';
import { Eoc } from "CddaJsonFormat";
import { genEOCID } from "ModDefine";
import { CnpcEventType } from "Event";



function hasAnim(outData:Record<string,JArray>,animType:AnimType){
    return outData[path.join("anim",animType)]
}

/**移除其他动作变异 */
export function removeOtherAnimEoc(charName:string,baseData:CharDefineData,animType:AnimType){
    const otherAnim = baseData.vaildAnim.filter(item=> item!=animType);
    if(otherAnim.length<=0) return null;
    const eoc:Eoc={
        type:"effect_on_condition",
        eoc_type: "ACTIVATION",
        id:genEOCID(charName+"_RemoveOtherAnimEoc_"+animType),
        effect:[
            ...otherAnim.map(otherAnimType=>({
                    u_lose_trait:baseData.animData[otherAnimType].mutID
                }))
        ]
    }
    return eoc;
}
/**切换动作EOC */
export function changeAnimEoc(charName:string,baseData:CharDefineData,animType:AnimType){
    const removeEoc = removeOtherAnimEoc(charName,baseData,animType);
    if(removeEoc==null) return [];
    const eoc:Eoc={
        type:"effect_on_condition",
        eoc_type: "ACTIVATION",
        id:genEOCID(charName+"_ChangeAnimEoc_"+animType),
        effect:[
            {"run_eocs":removeEoc.id},
            { "u_add_trait": baseData.animData[animType].mutID },
        ],
        condition:{not:{"u_has_trait": baseData.animData[animType].mutID}}
    }
    return [eoc,removeEoc];
}

/**创建动画状态机事件 */
export async function createAnimStatus(dm:DataManager,charName:string){
    const {defineData,outData} = await dm.getCharData(charName);
    const eocList:Eoc[] = [];
    const animEventMap:Record<AnimType,CnpcEventType|undefined>={
        Move:"CnpcMove",
        Attack:"CnpcTryHit",
        Idle:"CnpcIdle",
        //Death:"CnpcDeath",
    }
    //添加切换动画
    for(const mtnName in animEventMap){
        const animType = mtnName as AnimType;
        if(hasAnim(outData,animType)){
            let eocs = changeAnimEoc(charName,defineData,animType);
            eocList.push(...eocs);
            const eventName = animEventMap[animType];
            if(eventName!=null && eocs!=null)
                dm.addCharEvent(charName,eventName,0,eocs[0]);
        }
    }
    outData['anim_status'] = eocList;
}