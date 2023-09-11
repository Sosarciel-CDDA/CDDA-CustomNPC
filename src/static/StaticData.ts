import * as path from 'path';
import {JToken,UtilFT} from '@zwa73/utils'


/**静态数据的目录 */
export const StaticDataPath = path.join(process.cwd(),'StaticData');
/**保存静态数据 */
export function saveStaticData(name:string,data:JToken){
    UtilFT.writeJSONFile(path.join(StaticDataPath,name),data);
}