import * as path from 'path';
import * as  fs from 'fs';
import { JArray, JObject, JToken, UtilFT, UtilFunc } from '@zwa73/utils';
import { StaticDataMap } from './StaticData';
import { AnimType, AnimTypeList, formatAnimName } from './AnimTool';
import { genAmmiTypeID, genAmmoID, genArmorID, genEOCID, genEnchantmentID as genEnchantmentID, genFlagID, genGunID, genItemGroupID, genMutationID, genNpcClassID, genNpcInstanceID } from './ModDefine';
import { Eoc,MutationID,ItemGroupID,NpcClassID,NpcInstanceID,FlagID,AmmiunitionTypeID,AmmoID, ArmorID, GunID, StatusSimple, EnchantmentID, Gun, Generic, GenericID } from 'CddaJsonFormat';



/**角色事件列表 */
export const CharEvemtTypeList = [
    "CharIdle","CharMove","CharCauseHit","CharUpdate",
    "CharCauseMeleeHit","CharCauseRangeHit"
] as const;
/**角色事件类型 */
export type CharEventType = typeof CharEvemtTypeList[number];
/**全局事件列表 */
export const GlobalEvemtTypeList = ["PlayerUpdate",...CharEvemtTypeList] as const;
/**全局事件 */
export type GlobalEventType = typeof GlobalEvemtTypeList[number];

/**角色设定 */
export type CharConfig = {
    status:Record<StatusSimple,number>
    weapon:Gun|Generic;
}

/**主资源表 */
export type DataTable={
    /**输出的角色数据表 */
    charTable:Record<string,{
        /**角色基础数据 */
        baseData:CharData;
        /**输出数据 */
        outData:Record<string,JArray>;
        /**输出的角色Eoc事件 */
        charEventEocs:Record<CharEventType,Eoc>;
        /**角色设定 */
        charConfig:CharConfig;
    }>;
    /**输出的静态数据表 */
    staticTable:Record<string,JArray>;
    /**输出的Eoc事件 */
    eventEocs:Record<GlobalEventType,Eoc>;
}

/**build配置 */
export type BuildSetting={
    /**游戏目录 */
    game_path:string;
    /**游戏贴图包目录名 */
    target_gfx:string;
}

/**游戏数据 */
export type GameData={
    /**贴图包ID */
    gfx_name:string;
}

export class DataManager{
    /**资源目录 */
    dataPath = path.join(process.cwd(),'data');
    /**输出目录 */
    outPath:string;// = path.join(process.cwd(),'CustomNPC');
    /**角色目录 */
    charPath:string;
    /**角色列表 */
    charList:string[];
    /**build设置 */
    buildSetting:BuildSetting = null as any;
    /**游戏数据 */
    gameData:GameData = null as any;
    /**主资源表 */
    private dataTable:DataTable={
        charTable:{},
        staticTable:{},
        eventEocs:GlobalEvemtTypeList.reduce((acc,item)=>{
            const subEoc:Eoc={
                type:"effect_on_condition",
                eoc_type:"ACTIVATION",
                id:genEOCID(item),
                effect:[],
            }
            return {
                ...acc,
                [item]:subEoc
        }},{} as Record<GlobalEventType,Eoc>)
    }
    /**
     * @param dataPath 输入数据路径
     * @param outPath  输出数据路径
     */
    private constructor(dataPath?:string,outPath?:string){
        //合并静态数据
        this.dataTable.staticTable = Object.assign({},
            this.dataTable.staticTable,StaticDataMap);

        //初始化资源io路径
        this.outPath  = outPath as any;
        this.dataPath = dataPath||this.dataPath;

        this.charPath = path.join(this.dataPath,'chars');

        this.charList = fs.readdirSync(this.charPath).filter(fileName=>{
            const filePath = this.getCharPath(fileName);
            if(fs.statSync(filePath).isDirectory())
                return true;
        });
    }
    /**静态构造函数
     * @param dataPath 输入数据路径
     * @param outPath  输出数据路径
     */
    static async create(dataPath?:string,outPath?:string):Promise<DataManager>{
        let dm = new DataManager(dataPath,outPath);
        //读取build设置
        dm.buildSetting = (await UtilFT.loadJSONFile(path.join(dm.dataPath,'build_setting')))as BuildSetting;
        const bs = dm.buildSetting;
        dm.outPath = dm.outPath || path.join(bs.game_path,'data','mods','CustomNPC');

        //处理贴图包
        const gfxPath = path.join(bs.game_path,'gfx',bs.target_gfx);
        const gfxTilesetTxtPath = path.join(gfxPath,'tileset.txt');
        if(!(await UtilFT.pathExists(gfxTilesetTxtPath)))
            throw "未找到目标贴图包自述文件 path:"+gfxTilesetTxtPath;
        const match = (await fs.promises.readFile(gfxTilesetTxtPath,"utf-8"))
                        .match(/NAME: (.*?)$/m);
        if(match==null) throw "未找到目标贴图包NAME path:"+gfxTilesetTxtPath;
        dm.gameData={
            gfx_name:match[1],
        }
        //读取贴图包设置备份 无则创建
        let tileConfig:Record<string,any>;
        if((await UtilFT.pathExists(path.join(gfxPath,'tile_config_backup.json'))))
            tileConfig = await UtilFT.loadJSONFile(path.join(gfxPath,'tile_config_backup'));
        else{
            tileConfig = await UtilFT.loadJSONFile(path.join(gfxPath,'tile_config'));
            await UtilFT.writeJSONFile(path.join(gfxPath,'tile_config_backup'),tileConfig);
        }
        //寻找npc素体 并将ID改为变异素体
        let findMale = false;
        let findFemale = false;
        const fileObjList = tileConfig["tiles-new"] as any[];
        for(const fileObj of fileObjList){
            const tilesList = (fileObj.tiles as any[])
            for(const tilesObj of tilesList){
                if(tilesObj.id=="npc_female"){
                    tilesObj.id = `overlay_female_mutation_${genMutationID("BaseBody")}`
                    findFemale=true;
                }else if (tilesObj.id=="npc_male"){
                    tilesObj.id = `overlay_male_mutation_${genMutationID("BaseBody")}`
                    findMale=true;
                }
                if(findMale&&findFemale) break;
            }
            if(findMale&&findFemale) break;
        }
        if(!(findMale&&findFemale)) console.log("未找到贴图包素体");
        await UtilFT.writeJSONFile(path.join(gfxPath,'tile_config'),tileConfig);
        return dm;
    }

    /**获取角色表 如无则初始化 */
    async getCharData(charName:string){
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

            const charConfig:CharConfig = await UtilFT.loadJSONFile(path.join(this.getCharPath(charName),'config')) as any;
            console.log(charConfig);
            const baseData:CharData = {
                charName            : charName,
                baseMutID           : genMutationID(charName),
                classID             : genNpcClassID(charName),
                instanceID          : genNpcInstanceID(charName),
                animData            : animData,
                vaildAnim           : [],
                baseArmorID         : genArmorID(charName),
                baseWeaponID        : charConfig.weapon.id,
                baseWeaponGroupID   : genItemGroupID(`${charName}Weapon`),
                baseWeaponFlagID    : genFlagID(`${charName}Weapon`),
            }

            const charEventEocs = CharEvemtTypeList.reduce((acc,item)=>{
                const subEoc:Eoc={
                    type:"effect_on_condition",
                    eoc_type:"ACTIVATION",
                    id:genEOCID(`${item}_${charName}`),
                    effect:[],
                    condition:{u_has_trait:baseData.baseMutID}
                }
                return {
                    ...acc,
                    [item]:subEoc
            }},{} as Record<CharEventType,Eoc>)

            this.dataTable.charTable[charName] = {
                baseData,
                charEventEocs,
                charConfig,
                outData:{},
            }
        }
        return this.dataTable.charTable[charName];
    }
    /**添加事件 */
    addEvent(etype:GlobalEventType,...events:Eoc[]){
        this.dataTable.eventEocs[etype].effect?.push(
            ...events.map(eoc=>({"run_eocs":eoc.id}))
        );
    }
    /**添加角色事件 */
    addCharEvent(charName:string,etype:CharEventType,...events:Eoc[]){
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
            const charEventEocs:Eoc[]=[];
            for(const etype in charEvent){
                const et = etype as CharEventType;
                const ce = charEvent[et];
                charEventEocs.push(ce);
                this.addEvent(et,ce);
            }
            this.saveToCharFile(charName,'char_event_eocs',charEventEocs);

            //复制角色静态数据
            const charStaticDataPath = path.join(this.getCharPath(charName),"StaticData");
            await UtilFT.ensurePathExists(charStaticDataPath,true);
            //await
            fs.promises.cp(charStaticDataPath,this.getCharPath(charName),{ recursive: true });
        }

        //导出全局EOC
        const globalEvent = this.dataTable.eventEocs;
        const eventEocs:Eoc[]=[];
        for(const etype in globalEvent)
            eventEocs.push(globalEvent[etype as GlobalEventType]);
        this.saveToFile('event_eocs',eventEocs);


        //编译所有eocscript
        const {stdout,stderr} = await UtilFunc.exec(`\"./tools/EocScript\" --input ${this.outPath} --output ${this.outPath}`)
        console.log(stdout);
    }
}


/**角色基础数据 */
export type CharData=Readonly<{
    /**角色名 */
    charName    : string;
    /**基础变异ID */
    baseMutID   : MutationID;
    /**职业ID */
    classID     : NpcClassID;
    /**实例ID */
    instanceID  : NpcInstanceID;
    /**动画数据 */
    animData    : Record<AnimType,AnimData>;
    /**有效的动作动画 */
    vaildAnim: AnimType[];
    /**基础装备ID */
    baseArmorID : ArmorID;
    /**基础武器ID */
    baseWeaponID: GunID|GenericID;
    /**基础武器物品组ID */
    baseWeaponGroupID: ItemGroupID;
    /**基础武器Flag ID */
    baseWeaponFlagID: FlagID;
}>;

/**动画数据 */
export type AnimData = Readonly<{
    /**动画类型 */
    animType:AnimType;
    /**动画名 */
    animName:string;
    /**动画变异ID */
    mutID:MutationID;
    /**动画装备ID */
    armorID:ArmorID;
    /**动画装备物品组ID */
    itemGroupID:ItemGroupID;
}>;

