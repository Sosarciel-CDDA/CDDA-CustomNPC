import { createChar } from "CharBuild";
import { CDataManager } from "./DataManager";
import { commonBuild } from "./CommonBuild";
import { StaticDataMap } from "./StaticData/StaticData";
import { InitEventManager } from "./InitEvent";




export async function build(){
    const CMDm = new CDataManager();
    await InitEventManager(CMDm);
    await createChar(CMDm);
    await commonBuild(CMDm);
    //合并静态数据
    for(const key in StaticDataMap)
        CMDm.addStaticData(StaticDataMap[key],key)
    CMDm.saveAllData();
}