import { createChar } from "CharBuild";
import { CDataManager } from "./DataManager";
import { commonBuild } from "./CommonBuild";




export async function build(){
    const CMDm = new CDataManager();
    await createChar(CMDm);
    await commonBuild(CMDm);
}