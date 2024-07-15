import * as path from 'path';
import * as  fs from 'fs';
import { JObject, JToken, UtilFT, UtilFunc } from '@zwa73/utils';
import { StaticDataMap } from 'StaticData';
import { Eoc, AnyCddaJson, EocEffect } from 'cdda-schema';
import { DATA_PATH, OUT_PATH, getCharOutPath, getCharOutPathAbs, getCharPath } from 'CMDefine';
import { CharHook, DataManager } from 'cdda-event';
import { getCharMutId } from './CharBuild/UtilGener';


/**数据管理器 */
export class CDataManager extends DataManager{

    //———————————————————— 初始化 ————————————————————//
    constructor(){
        super(DATA_PATH,OUT_PATH,"CNPCEF");
        if(this._dataPath==null) throw "";
        //合并静态数据
        for(const key in StaticDataMap)
            this.addData(StaticDataMap[key],key)
    }

    /**添加 eoc的ID引用到 */
    addCharInvokeEoc(charName:string,etype:CharHook,weight:number,...events:Eoc[]){
        const effect:EocEffect = {
            if:{u_has_trait:getCharMutId(charName)},
            then:[{run_eocs:[...events.map(eoc=>eoc.id)]}]
        }
        super.addEvent(etype,weight,[effect]);
    }
    /**添加角色静态资源 */
    addCharData(charName:string,arr: JObject[], filePath: string, ...filePaths: string[]){
        super.addData(arr,path.join(getCharOutPath(charName),filePath,...filePaths));
    }
    /**输出数据 */
    async saveAllData(){
        super.saveAllData();

        //读取并处理角色
        const funcs = (await fs.promises.readdir(DATA_PATH))
            .filter(fileName=>fs.statSync(path.join(DATA_PATH,fileName)).isDirectory())
            .map(charName=> async ()=>{
                //复制角色静态数据
                const charStaticDataPath = path.join(getCharPath(charName),"StaticData");
                await UtilFT.ensurePathExists(charStaticDataPath,{dir:true});
                //await
                fs.promises.cp(charStaticDataPath,getCharOutPathAbs(charName),{ recursive: true });
            })
        Promise.all([...funcs.map((func)=>func())]);

        //编译所有eocscript
        const {stdout,stderr} = await UtilFunc.exec(`\"./tools/EocScript\" --input ${this._outPath} --output ${this._outPath}`)
        console.log(stdout);
    }
}

/**所有json的表 */
export class CddaJson{
    private readonly _table:Record<string,AnyCddaJson>;
    private readonly _jsonList:ReadonlyArray<AnyCddaJson>;
    private constructor(table:Record<string,AnyCddaJson>,jsonList:AnyCddaJson[]){
        this._table = table;
        this._jsonList = jsonList;
    }
    static async create(game_path:string):Promise<CddaJson>{
        //主表
        const table:Record<string,AnyCddaJson>={};

        //加载所有json
        const plist:Promise<JToken>[] = [];
        const jsonFilePathList = Object.values(UtilFT.fileSearchRegex(game_path,/\.json$/.source));
        jsonFilePathList.filter(filePath => !filePath.includes("CNPC") )
            .forEach(filePath => plist.push(UtilFT.loadJSONFile(filePath)) );
        const rawJsonList = await Promise.all(plist);
        //筛选有效json
        function processJson(json:any){
            if(typeof json == "object" &&
                "type" in json &&
                "id" in json &&
                typeof json.id == "string")
                table[`${json.type}_${json.id}`] = json;
        }
        rawJsonList.forEach(item=>{
            if(Array.isArray(item))
                item.forEach(subitem=>processJson(subitem));
            else processJson(item);
        });

        const cddajson = new CddaJson(table,Object.values(table));
        return cddajson;
    }
    getJson(type:string,id:string):AnyCddaJson|undefined{
        return  this._table[`${type}_${id}`];
    }
    jsonList(){
        return this._jsonList;
    }
}

