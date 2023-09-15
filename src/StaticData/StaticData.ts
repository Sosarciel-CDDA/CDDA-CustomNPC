import {JObject, JToken,UtilFT} from '@zwa73/utils'


export const StaticDataMap:JObject={};
/**保存静态数据 */
export async function saveStaticData(name:string,data:JToken){
    //const filePath = path.join(StaticDataPath,name);
    //await UtilFT.writeJSONFile(filePath,data);
    //console.log(filePath+" 写入完成")
    StaticDataMap[name]=data;
}

