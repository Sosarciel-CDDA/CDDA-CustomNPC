import {JArray, JObject, JToken,UtilFT} from '@zwa73/utils'
import * as path from 'path';

export const StaticDataMap:Record<string,JArray>={};
/**保存静态数据 */
export async function saveStaticData(data:JArray,filePath:string,...filePaths:string[]){
    //const filePath = path.join(StaticDataPath,name);
    //await UtilFT.writeJSONFile(filePath,data);
    //console.log(filePath+" 写入完成")
    StaticDataMap[path.join(filePath,...filePaths)]=data;
}

