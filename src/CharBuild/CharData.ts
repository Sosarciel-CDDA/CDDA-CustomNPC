import { JObject, UtilFT } from "@zwa73/utils";
import { CharConfig } from "./CharInterface";
import * as path from 'path';
import * as fs from 'fs';
import { CHARS_PATH, DATA_PATH, getCharPath } from "CMDefine";

//处理角色配置文件
const CharList:string[] = [];
const CharConfigMap:Record<string,CharConfig> = {};
let count=0;
//继承
function extendCharConfig(target:JObject,...sources:JObject[]):JObject{
    sources = [...sources.reverse(),target];
    let out:JObject = {};
    for(const obj of sources){
        for(const key in obj){
            if(key=="extends") continue;
            if(key=="virtual") continue;
            const value = obj[key];
            if(Array.isArray(value)){
                out[key] = out[key]==null
                    ? value
                    : [...(out[key] as []),...value];
            }else if(typeof value == "object"){
                out[key] = out[key]==null
                    ? value
                    : Object.assign({},out[key],value)
            }else out[key] = value;
        }
    }
    return out;
}
/**获取角色配置文件 */
export const getCharConfig = async (charName:string):Promise<CharConfig>=>{
    if(CharConfigMap[charName]!=null) return CharConfigMap[charName];
    count++;
    if(count>1000) throw 'loadCharConfig 调用次数过多(>1000) 可能是循环继承';
    const charConfig:CharConfig = await UtilFT.loadJSONFile(path.join(getCharPath(charName),'config')) as any;
    if(charConfig.extends?.includes(charName)) throw `${charName} 不应继承自身`;
    const exts:CharConfig[] = [];
    for(const char of charConfig.extends||[])
        exts.push(await getCharConfig(char));
    CharConfigMap[charName] = extendCharConfig(charConfig,...exts);
    return CharConfigMap[charName];
}
/**获取角色列表 */
export const getCharList = async ()=>{
    if(CharList.length>0) return CharList;
    let baseList = (await fs.promises.readdir(CHARS_PATH))
        .filter(fileName=>fs.statSync(path.join(CHARS_PATH,fileName)).isDirectory());

    const filteredList = (await Promise.all(baseList.map(async charName => {
        const charConfig = await getCharConfig(charName);
        if (charConfig.virtual !== true) return charName;
        return null;
    }))).filter((item)=>item!==null) as string[];

    CharList.push(...filteredList);
    return CharList;
}
