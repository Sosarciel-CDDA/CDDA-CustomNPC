import * as path from 'path';
import * as  fs from 'fs';
import { JToken, UtilFT } from '@zwa73/utils';

/**mod物品前缀 */
export const MOD_PREFIX = "CNPC";

/**资源目录 */
export const DATA_PATH = path.join(process.cwd(),'data');
/**角色列表 */
export const CHAR_LIST = fs.readdirSync(DATA_PATH).filter(fileName=>{
    const filePath = getCharPath(fileName);
    if(fs.statSync(filePath).isDirectory())
        return true;
});
/**获取 角色目录 */
export function getCharPath(charName:string){
    return path.join(DATA_PATH,charName);
}


/**输出目录 */
export const OUT_PATH = path.join(process.cwd(),'CustomNPC');

/**获取 输出角色目录 */
export function getOutCharPath(charName:string){
    return path.join(OUT_PATH,'chars',charName);
}
/**输出数据到角色目录 */
export async function outCharFile(charName:string,filePath:string,obj:JToken) {
    return UtilFT.writeJSONFile(path.join(getOutCharPath(charName),filePath),obj);
}

