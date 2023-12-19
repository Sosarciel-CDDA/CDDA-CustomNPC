import * as path from 'path';
import * as  fs from 'fs';
import { JArray, JObject, JToken, UtilFT, UtilFunc } from '@zwa73/utils';
import { StaticDataMap } from 'StaticData';
import { genArmorID, genEOCID, genEnchantmentID , genFlagID, genGenericID, genItemGroupID, genMutationID, genNpcClassID, genNpcInstanceID, genTalkTopicID } from 'ModDefine';
import { Eoc,MutationID,ItemGroupID,NpcClassID,NpcInstanceID,FlagID, ArmorID, GunID, EnchantmentID, GenericID, SoundEffect, SoundEffectVariantID, SoundEffectID, AnyCddaJson, AnyItemID, BoolObj, TalkTopicID, Resp } from 'cdda-schema';
import { CharConfig, loadCharConfig, AnimType, AnimTypeList, formatAnimName } from 'CharBuild';
import { CCharHookList, CCharHook, EventEffect, CGlobalHook, CGlobalHookList, buildEventFrame } from "CnpcEvent";



/**角色定义数据 */
export type CharDefineData=Readonly<{
    /**角色名 */
    charName    : string;
    /**基础变异ID 角色必定会拥有此变异 可以作为角色判断依据 */
    baseMutID   : MutationID;
    /**职业ID */
    classID     : NpcClassID;
    /**实例ID */
    instanceID  : NpcInstanceID;
    /**动画数据 */
    animData    : Record<AnimType,AnimData>;
    /**有效的动作动画 */
    validAnim   : AnimType[];
    /**基础装备ID */
    baseArmorID : ArmorID;
    /**基础装备附魔ID */
    baseEnchID  : EnchantmentID;
    /**基础武器FlagID 用于分辨是否为角色专用物品 */
    baseItemFlagID: FlagID;
    /**基础背包物品组 */
    baseCarryGroup:ItemGroupID;
    /**主对话ID */
    talkTopicID   :TalkTopicID;
    /**卡片ID */
    cardID        :GenericID;
    /**控制施法的Resp */
    castResp      :Resp[];
}>;

/**角色数据 */
type CharData = {
    /**角色基础定义数据 */
    defineData:CharDefineData;
    /**输出数据 */
    outData:Record<string,JArray>;
    /**输出的角色Eoc事件 u为角色 npc为未定义  
     * id为 `${charName}_${etype}`  
     */
    charEventEocs:Record<CCharHook,EventEffect[]>;
    /**角色设定 */
    charConfig:CharConfig;
}

/**主资源表 */
export type DataTable={
    /**输出的角色数据表 */
    charTable:Record<string,CharData>;
    /**输出的静态数据表 */
    staticTable:Record<string,JArray>;
    /**输出的Eoc事件 */
    eventEocs:Record<CGlobalHook,EventEffect[]>;
    /**共用资源表 */
    sharedTable:Record<string,Record<string,JObject>>;
}

/**build配置 */
export type BuildSetting={
    /**游戏目录 */
    game_path:string;
    /**游戏贴图包目录名 */
    target_gfxpack:string;
    /**游戏音效包目录名 */
    target_soundpack:string;
}

/**游戏数据 */
export type GameData={
    /**贴图包ID */
    gfx_name?:string;
    /**JSON */
    game_json?:CddaJson;
}

/**数据管理器 */
export class DataManager{
    /**资源目录 */
    dataPath = path.join(process.cwd(),'data');
    /**输出目录 */
    outPath:string;// = path.join(process.cwd(),'CustomNPC');
    /**角色目录 */
    charPath:string;
    /**角色列表 */
    charList:string[];
    /**虚拟角色列表 */
    virtualCharList:string[];
    /**build设置 */
    buildSetting:BuildSetting = null as any;
    /**游戏数据 */
    gameData:GameData = {};
    /**主资源表 */
    private dataTable:DataTable={
        charTable:{},
        staticTable:{},
        sharedTable:{},
        eventEocs:CGlobalHookList.reduce((acc,etype)=>
            ({...acc,[etype]:[]}),{} as Record<CGlobalHook,EventEffect[]>)
    }



    //———————————————————— 初始化 ————————————————————//
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

        //创建角色列表
        this.virtualCharList = [];
        this.charList = fs.readdirSync(this.charPath).filter(fileName=>{
            const filePath = this.getCharPath(fileName);
            if(!fs.statSync(filePath).isDirectory()) return false;
            const configFile = path.join(filePath,"config.json");
            if(!UtilFT.pathExistsSync(configFile)) return false;
            if(UtilFT.loadJSONFileSync(configFile).virtual === true){
                this.virtualCharList.push(fileName);
                return false;
            }
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

        await dm.processGfxpack();
        await dm.processSoundpack();
        //await dm.processJson();
        return dm;
    }
    /**初始化 处理贴图包 */
    private async processGfxpack(){
        const bs = this.buildSetting;
        const dm = this;
        //处理贴图包
        const gfxPath = path.join(bs.game_path,'gfx',bs.target_gfxpack);
        const gfxTilesetTxtPath = path.join(gfxPath,'tileset.txt');
        if(!(await UtilFT.pathExists(gfxTilesetTxtPath)))
            throw "未找到目标贴图包自述文件 path:"+gfxTilesetTxtPath;
        const match = (await fs.promises.readFile(gfxTilesetTxtPath,"utf-8"))
                        .match(/NAME: (.*?)$/m);
        if(match==null) throw "未找到目标贴图包NAME path:"+gfxTilesetTxtPath;
        //写入贴图名
        dm.gameData.gfx_name=match[1];
        //读取贴图包设置备份 无则创建
        let tileConfig:Record<string,any>;
        if((await UtilFT.pathExists(path.join(gfxPath,'tile_config.json'))))
            tileConfig = await UtilFT.loadJSONFile(path.join(gfxPath,'tile_config.json'));
        else throw ("未找到贴图包 tile_config.json");
        //记录默认数据
        const defSet = tileConfig.tile_info[0];
        defSet.sprite_width  = defSet.width ;
        defSet.sprite_height = defSet.height;
        delete defSet.width ;
        delete defSet.height;
        delete tileConfig.tile_info;
        //寻找npc素体 并将ID改为变异素体
        let findMale = false;
        let findFemale = false;
        //let count = 0;
        const fileObjList = tileConfig["tiles-new"] as any[];
        for(const fileObj of fileObjList){
            const tilesList = (fileObj.tiles as any[]);
            //载入默认数据
            for(const key in defSet){
                if(fileObj[key] == null)
                    fileObj[key] = defSet[key];
            }
            //删除ascii
            if(fileObj.ascii)
                fileObj.ascii = [];
            //替换目录名
            if(fileObj.file)
                fileObj.file = path.join('..','..','..','gfx',bs.target_gfxpack,fileObj.file);
            fileObj.iso = undefined;
            fileObj.retract_dist_min = undefined;
            fileObj.retract_dist_max = undefined;
            //替换tiles
            fileObj.tiles = tilesList.filter(tilesObj => {
                if(tilesObj.id=="npc_female"){
                    tilesObj.id = `overlay_female_mutation_${genMutationID("BaseBody")}`
                    findFemale=true;
                    return true;
                }else if (tilesObj.id=="npc_male"){
                    tilesObj.id = `overlay_male_mutation_${genMutationID("BaseBody")}`
                    findMale=true;
                    return true;
                }
                return false;
            });
            //count++;
            //if(findMale&&findFemale) break;
        }
        //删除多余部分
        //tileConfig["tiles-new"] = (tileConfig["tiles-new"] as any[]).slice(0,count);

        if(!(findMale&&findFemale)) console.log("未找到贴图包素体");
        //设置基本属性
        tileConfig.compatibility = [dm.gameData.gfx_name];
        tileConfig.type = "mod_tileset";
        //写入mod文件夹
        await dm.saveToFile("modgfx_tileset.json",[tileConfig]);


        //写入基础贴图配置
        await dm.saveToFile("mod_tileset.json", [{
            type: "mod_tileset",
            compatibility: [dm.gameData.gfx_name],
            "tiles-new": [{
                file: "32xTransparent.png",
                sprite_width: 32,
                sprite_height: 32,
                sprite_offset_x: 0,
                sprite_offset_y: 0,
                pixelscale: 1,
                tiles: [
                    { id: "npc_female"  , fg: 0, bg: 0 },
                    { id: "npc_male"    , fg: 0, bg: 0 },
                    { id: "CNPC_GENERIC_TransparentItem", fg: 0, bg: 0 },
                ]
            }],
        }]);
    }
    /**初始化 处理音效包 */
    private async processSoundpack(){
        const bs = this.buildSetting;
        const dm = this;
        //删除旧的音效资源
        const soundPath = path.join(bs.game_path,'data','sound',bs.target_soundpack,'cnpc');
        await fs.promises.rm(soundPath, { recursive: true, force: true });

        //遍历角色
        const allchar = [...dm.charList,...dm.virtualCharList];
        for(const charName of allchar){
            //确认角色输出文件夹
            const charOutAudioFolder = path.join(soundPath,charName);
            await UtilFT.ensurePathExists(charOutAudioFolder,true);

            //遍历并找出所有音效文件夹
            const charAudioFolderPath = path.join(dm.getCharPath(charName),'audio');
            await UtilFT.ensurePathExists(charAudioFolderPath,true);
            const charAudioList = (await fs.promises.readdir(charAudioFolderPath))
                .filter(fileName=> fs.statSync(path.join(charAudioFolderPath,fileName)).isDirectory());

            //复制音效文件夹到输出
            for(const audioFolderName of charAudioList){
                const charAudioPath = path.join(charAudioFolderPath,audioFolderName);
                const outAudioPath = path.join(charOutAudioFolder,audioFolderName);
                await fs.promises.cp(charAudioPath,outAudioPath,{recursive:true});
                //找到所有子音效
                const subAudio = (await fs.promises.readdir(charAudioPath))
                    .filter(fileName=> [".ogg",".wav"].includes(path.parse(fileName).ext));

                //创建音效配置 音效id为角色名 变体id为文件夹名 内容为子文件
                const se:SoundEffect={
                        type: "sound_effect",
                        id: charName as SoundEffectID,
                        variant: audioFolderName as SoundEffectVariantID,
                        volume: 100,
                        files: [ ...subAudio.map( fileName =>
                                path.join('cnpc',charName,audioFolderName,fileName)) ]
                }
                //根据预留武器音效字段更改ID
                const defineList = [
                    "fire_gun"          ,//枪械射击
                    "fire_gun_distant"  ,//枪械射击 远距
                    "reload"            ,//枪械装弹
                    "melee_hit_flesh"   ,//近战攻击肉质
                    "melee_hit_metal"   ,//近战攻击金属质
                    "melee_hit"         ,//近战攻击
                ] as const;
                //(武器id)_(类型)
                const defmatch = audioFolderName.match(/^(.+?)_(.+)$/);
                if(defmatch!=null && defineList.includes(defmatch[2] as any)){
                    se.id = defmatch[2] as SoundEffectID;
                    se.variant = defmatch[1] as SoundEffectVariantID;
                    //se.variant = (await dm.getCharData(charName)).charConfig.weapon?.id as SoundEffectVariantID;
                }
                await UtilFT.writeJSONFile(path.join(charOutAudioFolder,audioFolderName),[se]);
            }
        }
    }
    /**载入所有json */
    private async processJson(){
        const bs = this.buildSetting;
        const dm = this;

        const cddajson = await CddaJson.create(bs.game_path);
        dm.gameData.game_json = cddajson;
    }




    //———————————————————— 工具 ————————————————————//
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

            const charConfig:CharConfig = await loadCharConfig(this,charName);
            console.log(charConfig);
            const defineData:CharDefineData = {
                charName            : charName,
                baseMutID           : genMutationID(charName),
                classID             : genNpcClassID(charName),
                instanceID          : genNpcInstanceID(charName),
                animData            : animData,
                validAnim           : [],
                baseArmorID         : genArmorID(charName),
                baseEnchID          : genEnchantmentID(charName),
                baseItemFlagID      : genFlagID(`${charName}_WeaponFlag`),
                baseCarryGroup      : genItemGroupID(`${charName}_Carry`),
                talkTopicID         : genTalkTopicID(charName),
                cardID              : genGenericID(`${charName}_Card`),
                castResp            : []
            }

            //角色事件eoc主体
            const charEventEocs = CCharHookList.reduce((acc,etype)=>(
                {...acc,[etype]:[]}),{} as Record<CCharHook,EventEffect[]>)

            this.dataTable.charTable[charName] = {
                defineData,
                charEventEocs,
                charConfig,
                outData:{},
            }
        }
        return this.dataTable.charTable[charName];
    }
    /**添加 eoc的ID引用到 全局事件  
     * u为主角 npc为未定义  
     */
    addEvent(etype:CGlobalHook,weight:number,...events:Eoc[]){
        this.dataTable.eventEocs[etype].push(
            ...events.map(eoc=>({effect:{"run_eocs":eoc.id},weight}))
        );
    }
    /**添加 eoc的ID引用到 角色事件  
     * u为角色 npc为未定义  
     */
    addCharEvent(charName:string,etype:CCharHook,weight:number,...events:Eoc[]){
        this.dataTable.charTable[charName].charEventEocs[etype].push(
            ...events.map(eoc=>({effect:{"run_eocs":eoc.id},weight}))
        );
    }
    /**获取 角色目录 */
    getCharPath(charName:string){
        return path.join(this.charPath,charName);
    }
    /**获取 输出角色目录 */
    getOutCharPath(charName:string){
        return path.join(this.outPath,'chars',charName);
    }
    /**添加共享资源 同filepath+key会覆盖 出现与原数据不同的数据时会提示 */
    addSharedRes(key:string,val:JObject,filePath:string,...filePaths:string[]){
        const fixPath = path.join(filePath,...filePaths);
        if(this.dataTable.sharedTable[fixPath]==null)
            this.dataTable.sharedTable[fixPath]={};
        const table = this.dataTable.sharedTable[fixPath];
        const oval = table[key];
        table[key]=val;
        if(oval!=null){
            if(JSON.stringify(oval)!=JSON.stringify(val))
                console.log(`addSharedRes 出现了一个不相同的数据 \n原数据:${JSON.stringify(oval)}\n新数据:${JSON.stringify(val)}`);
        }
    }
    /**添加静态资源 */
    addStaticData(arr:JObject[],filePath:string,...filePaths:string[]){
        this.dataTable.staticTable[path.join(filePath,...filePaths)] = arr;
    }



    //———————————————————— 输出 ————————————————————//
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
        for(let filePath in staticData){
            let obj = staticData[filePath];
            //await
            this.saveToFile(filePath,obj);
        }

        //导出共用资源
        for(const filePath in this.dataTable.sharedTable)
            this.saveToFile(filePath,Object.values(this.dataTable.sharedTable[filePath]));


        //导出角色数据
        for(let charName of this.charList){
            const charData = this.dataTable.charTable[charName];
            const charOutData = charData.outData;
            for(let key in charOutData){
                let obj = charOutData[key];
                //await
                this.saveToCharFile(charName,key,obj);
            }
            //导出角色EOC
            const charEventMap = Object.assign({},charData.charEventEocs);
            const charEventEocs:Eoc[]=[];
            //遍历事件类型
            for(const etypeStr in charEventMap){
                const etype = etypeStr as (CCharHook);
                //降序排序事件
                const charEventList = charEventMap[etype].sort((a,b)=>b.weight-a.weight);
                //至少有一个角色事件才会创建
                if(charEventList.length>0){
                    //创建角色触发Eoc
                    const eventEoc:Eoc = {
                        type:"effect_on_condition",
                        eoc_type:"ACTIVATION",
                        id:genEOCID(`${charName}_${etype}`),
                        effect:[...charEventList.map(event=>event.effect)],
                        condition:{u_has_trait:charData.defineData.baseMutID}
                    }
                    charEventEocs.push(eventEoc);
                    //将角色触发eoc注册入全局eoc
                    this.addEvent(etype,0,eventEoc);
                }
            }
            this.saveToCharFile(charName,'char_event_eocs',charEventEocs);

            //复制角色静态数据
            const charStaticDataPath = path.join(this.getCharPath(charName),"StaticData");
            await UtilFT.ensurePathExists(charStaticDataPath,true);
            //await
            fs.promises.cp(charStaticDataPath,this.getOutCharPath(charName),{ recursive: true });
        }

        //导出全局EOC
        const globalEvent = this.dataTable.eventEocs;
        const eventEocs:Eoc[]=[];
        for(const etype in globalEvent){
            //降序排序事件
            const globalEvents = globalEvent[etype as CGlobalHook].sort((a,b)=>b.weight-a.weight);
            //创建全局触发Eoc
            const globalEoc:Eoc={
                type:"effect_on_condition",
                eoc_type:"ACTIVATION",
                id:genEOCID(etype),
                effect:[...globalEvents.map(event=>event.effect)],
            }
            eventEocs.push(globalEoc);
        }
        this.saveToFile('event_eocs',eventEocs);

        //导出event框架
        this.saveToFile('event_frame',buildEventFrame());

        //编译所有eocscript
        const {stdout,stderr} = await UtilFunc.exec(`\"./tools/EocScript\" --input ${this.outPath} --output ${this.outPath}`)
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
        const jsonFilePathList = Object.values(UtilFT.fileSearch(game_path,/\.json$/.source));
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

