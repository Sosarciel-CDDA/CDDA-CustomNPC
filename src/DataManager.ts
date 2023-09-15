import * as path from 'path';
import * as  fs from 'fs';
import { JArray, JObject, JToken, UtilFT } from '@zwa73/utils';
import { StaticDataMap } from './StaticData';
import { AnimType, AnimTypeList, formatAnimName } from './AnimTool';
import { genNpcInstanceID,genNpcClassID,genItemGroupID,genArmorID,genMutationID } from 'CddaJsonFormat';

/**mod物品前缀 */
export const MOD_PREFIX = "CNPC";

export type DataTable={
    /**输出的角色数据表 */
    charTable:Record<string,{
        /**角色基础数据 */
        baseData:CharData;
        /**输出数据 */
        outData:Record<string,JArray>;
    }>;
    /**输出的静态数据表 */
    staticTable:Record<string,JObject>;
}
export class DataManager{
    /**资源目录 */
    dataPath = path.join(process.cwd(),'data');
    /**输出目录 */
    outPath = path.join(process.cwd(),'CustomNPC');
    /**角色目录 */
    charPath:string;
    /**角色列表 */
    charList:string[];
    /**主资源表 */
    private dataTable:DataTable={
        charTable:{},
        staticTable:{},
    }
    constructor(outPath?:string,dataPath?:string){
        this.dataTable.staticTable = Object.assign({},
            this.dataTable.staticTable,StaticDataMap);

        this.outPath  = outPath||this.outPath;
        this.dataPath = dataPath||this.dataPath;

        this.charPath = path.join(this.dataPath,'chars');

        this.charList = fs.readdirSync(this.charPath).filter(fileName=>{
            const filePath = this.getCharPath(fileName);
            if(fs.statSync(filePath).isDirectory())
                return true;
        });
    }

    /**获取角色表 如无则初始化 */
    getCharData(charName:string){
        //初始化基础数据
        if(this.dataTable.charTable[charName] == null){
            const animData = AnimTypeList.map(animType=>({
                animType:animType,
                animName:formatAnimName(charName,animType),
                mutID:genMutationID(formatAnimName(charName,animType)),
                armorID:genArmorID(formatAnimName(charName,animType)),
                itemGroupID:genItemGroupID(formatAnimName(charName,animType)),
            })).reduce((acc, curr) => {
                acc[curr.animType] = curr;
                return acc;
            }, {} as Record<AnimType,AnimData>);

            const baseData:CharData = {
                charName    : charName,
                baseMutID   : genMutationID(charName),
                classID     : genNpcClassID(charName),
                instanceID  : genNpcInstanceID(charName),
                animData    : animData,
            }
            this.dataTable.charTable[charName] = {baseData,outData:{}}
        }
        return this.dataTable.charTable[charName];
    }

    /**获取 角色目录 */
    getCharPath(charName:string){
        return path.join(this.charPath,charName);
    }
    /**获取 角色图片目录 */
    getCharImagePath(charName:string){
        return path.join(this.getCharPath(charName),'image');
    }

    /**获取 输出角色目录 */
    getOutCharPath(charName:string){
        return path.join(this.outPath,'chars',charName);
    }
    /**输出数据到角色目录 */
    async saveToCharFile(charName:string,filePath:string,obj:JToken) {
        return UtilFT.writeJSONFile(path.join(this.getOutCharPath(charName),filePath),obj);
    }
    /**输出数据到主目录 */
    async saveToFile(filePath:string,obj:JToken){
        return UtilFT.writeJSONFile(path.join(this.outPath,filePath),obj);
    }

    /**输出数据 */
    async saveAllData(){
        //复制静态数据
        const staticDataPath = path.join(this.dataPath,"StaticData");
        UtilFT.ensurePathExists(staticDataPath,true);
        //await
        fs.promises.cp(staticDataPath,this.outPath,{ recursive: true });
        //导出js静态数据
        const staticData = this.dataTable.staticTable;
        for(let key in staticData){
            let obj = staticData[key];
            //await
            this.saveToFile(key,obj);
        }
        //导出角色数据
        for(let charName in this.dataTable.charTable){
            const charOutData = this.dataTable.charTable[charName].outData;
            for(let key in charOutData){
                let obj = charOutData[key];
                //await
                this.saveToCharFile(charName,key,obj);
            }
        }
    }
}


/**角色基础数据 */
export type CharData=Readonly<{
    /**角色名 */
    charName    : string;
    /**基础变异ID */
    baseMutID   : string;
    /**职业ID */
    classID     : string;
    /**实例ID */
    instanceID  : string;
    /**动画数据 */
    animData    : Record<AnimType,AnimData>;
}>;

/**动画数据 */
export type AnimData = Readonly<{
    /**动画类型 */
    animType:AnimType;
    /**动画名 */
    animName:string;
    /**动画变异ID */
    mutID:string;
    /**动画装备ID */
    armorID:string;
    /**动画装备物品组ID */
    itemGroupID:string;
}>;

