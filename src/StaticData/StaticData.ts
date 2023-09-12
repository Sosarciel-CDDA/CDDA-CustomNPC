import * as path from 'path';
import {JToken,UtilFT} from '@zwa73/utils'


/**静态数据的目录 */
export const StaticDataPath = path.join(process.cwd(),'CustomNpc');
/**保存静态数据 */
export async function saveStaticData(name:string,data:JToken){
    const filePath = path.join(StaticDataPath,name);
    await UtilFT.writeJSONFile(filePath,data);
    console.log(filePath+" 写入完成")
}