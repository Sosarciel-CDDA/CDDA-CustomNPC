import * as path from 'path';
import * as  fs from 'fs';
import { JArray, JObject, JToken, UtilFT } from '@zwa73/utils';
import { StaticDataMap } from './StaticData';
import { AnimType, AnimTypeList, formatAnimName } from './AnimTool';
import { genAmmiTypeID, genAmmoID, genArmorID, genEOCID, genFlagID, genGenericID, genItemGroupID, genMutationID, genNpcClassID, genNpcInstanceID } from './ModDefine';
import { EOC } from './CddaJsonFormat/EOC';


/**角色事件列表 */
export const CharEvemtTypeList = ["CharIdle","CharMove","CharCauseHit","CharUpdate"] as const;
/**角色事件类型 */
export type CharEventType = typeof CharEvemtTypeList[number];
/**全局事件列表 */
export const GlobalEvemtTypeList = ["PlayerUpdate",...CharEvemtTypeList] as const;
/**全局事件 */
export type GlobalEventType = typeof GlobalEvemtTypeList[number];

/**主资源表 */
export type DataTable={
    /**输出的角色数据表 */
    charTable:Record<string,{
        /**角色基础数据 */
        baseData:CharData;
        /**输出数据 */
        outData:Record<string,JArray>;
        /**输出的角色Eoc事件 */
        charEventEocs:Record<CharEventType,EOC>;
    }>;
    /**输出的静态数据表 */
    staticTable:Record<string,JObject>;
    /**输出的Eoc事件 */
    eventEocs:Record<GlobalEventType,EOC>;
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
        eventEocs:GlobalEvemtTypeList.reduce((acc,item)=>{
            const subEoc:EOC={
                type:"effect_on_condition",
                eoc_type:"ACTIVATION",
                id:genEOCID(item),
                effect:[],
            }
            return {
                ...acc,
                [item]:subEoc
        }},{} as Record<GlobalEventType,EOC>)
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
                charName            : charName,
                baseMutID           : genMutationID(charName),
                classID             : genNpcClassID(charName),
                instanceID          : genNpcInstanceID(charName),
                animData            : animData,
                vaildAnim           : [],
                baseArmorID         : genArmorID(charName),
                baseWeaponID        : genGenericID(`${charName}Weapon`),
                baseAmmoID          : genAmmoID(charName),
                baseAmmoTypeID      : genAmmiTypeID(charName+"Ammo"),
                baseWeaponGroupID   : genItemGroupID(`${charName}Weapon`),
                baseWeaponFlagID    : genFlagID(`${charName}Weapon`),
            }

            const charEventEocs = CharEvemtTypeList.reduce((acc,item)=>{
                const subEoc:EOC={
                    type:"effect_on_condition",
                    eoc_type:"ACTIVATION",
                    id:genEOCID(`${item}_${charName}`),
                    effect:[],
                    condition:{u_has_trait:baseData.baseMutID}
                }
                return {
                    ...acc,
                    [item]:subEoc
            }},{} as Record<CharEventType,EOC>)
            this.dataTable.charTable[charName] = {baseData,outData:{},charEventEocs}
        }
        return this.dataTable.charTable[charName];
    }
    /**添加事件 */
    addEvent(etype:GlobalEventType,...events:EOC[]){
        this.dataTable.eventEocs[etype].effect?.push(
            ...events.map(eoc=>({"run_eocs":eoc.id}))
        );
    }
    /**添加角色事件 */
    addCharEvent(charName:string,etype:CharEventType,...events:EOC[]){
        this.dataTable.charTable[charName].charEventEocs[etype].effect?.push(
            ...events.map(eoc=>({"run_eocs":eoc.id}))
        );
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
            const charData = this.dataTable.charTable[charName];
            const charOutData = charData.outData;
            for(let key in charOutData){
                let obj = charOutData[key];
                //await
                this.saveToCharFile(charName,key,obj);
            }
            //导出角色EOC
            const charEvent = charData.charEventEocs;
            const charEventEocs:EOC[]=[];
            for(const etype in charEvent){
                const et = etype as CharEventType;
                const ce = charEvent[et];
                charEventEocs.push(ce);
                this.addEvent(et,ce);
            }
            this.saveToCharFile(charName,'char_event_eocs',charEventEocs);
        }
        //导出全局EOC
        const globalEvent = this.dataTable.eventEocs;
        const eventEocs:EOC[]=[];
        for(const etype in globalEvent)
            eventEocs.push(globalEvent[etype as GlobalEventType]);
        this.saveToFile('event_eocs',eventEocs);
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
    /**有效的动作 */
    vaildAnim: AnimType[];
    /**基础装备ID */
    baseArmorID : string;
    /**基础武器ID */
    baseWeaponID: string;
    /**基础弹药ID */
    baseAmmoID: string;
    /**基础弹药类型ID */
    baseAmmoTypeID: string;
    /**基础武器物品组ID */
    baseWeaponGroupID: string;
    /**基础武器Flag ID */
    baseWeaponFlagID: string;
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

