import * as path from 'path';
import * as fs from "fs";
import {JObject, JToken,UtilFT} from '@zwa73/utils'
import { DATA_PATH, OUT_PATH, outFile } from '@src/DataManager';


/**静态数据的目录 */
export const StaticDataPath = OUT_PATH;
const StaticDataMap:JObject={};
/**保存静态数据 */
export async function saveStaticData(name:string,data:JToken){
    //const filePath = path.join(StaticDataPath,name);
    //await UtilFT.writeJSONFile(filePath,data);
    //console.log(filePath+" 写入完成")
    StaticDataMap[name]=data;
}
/**输出静态数据 */
export async function outStaticData(){
    //复制静态数据
    const staticDataPath = path.join(DATA_PATH,"StaticData");
    UtilFT.ensurePathExists(staticDataPath,true);
    await fs.promises.cp(staticDataPath,OUT_PATH,{ recursive: true });
    //导出js静态数据
    for(let key in StaticDataMap){
        let obj = StaticDataMap[key];
        await outFile(key,obj);
    }
}