import { createChar } from "CharBuild";
import { CDataManager } from "./DataManager";
import { commonBuild } from "./CommonBuild";
import { StaticDataMap } from "./StaticData/StaticData";




export async function build(){
    const CMDm = new CDataManager();
    await createChar(CMDm);
    await commonBuild(CMDm);
    //合并静态数据
    for(const key in StaticDataMap)
        CMDm.addStaticData(StaticDataMap[key],key)
    CMDm.saveAllData();
}