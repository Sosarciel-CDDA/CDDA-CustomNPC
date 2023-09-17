import {JArray, JObject, JToken,UtilFT} from '@zwa73/utils'


export const StaticDataMap:Record<string,JArray>={};
/**保存静态数据 */
export async function saveStaticData(name:string,data:JArray){
    //const filePath = path.join(StaticDataPath,name);
    //await UtilFT.writeJSONFile(filePath,data);
    //console.log(filePath+" 写入完成")
    StaticDataMap[name]=data;
}

