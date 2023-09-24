import * as path from 'path';
import * as  fs from 'fs';
import { JArray, JObject, JToken, UtilFT, UtilFunc } from '@zwa73/utils';
import { StaticDataMap } from './StaticData';
import { AnimType, AnimTypeList, formatAnimName } from './AnimTool';
import { genAmmiTypeID, genAmmoID, genArmorID, genEOCID, genEnchantmentID as genEnchantmentID, genFlagID, genGunID, genItemGroupID, genMutationID, genNpcClassID, genNpcInstanceID } from './ModDefine';
import { Eoc,MutationID,ItemGroupID,NpcClassID,NpcInstanceID,FlagID,AmmunitionTypeID,AmmoID, ArmorID, GunID, StatusSimple, EnchantmentID, Gun, Generic, GenericID, EnchArmorValType, EnchGenericValType, BoolObj, Spell, SoundEffect, SoundEffectVariantID, SoundEffectID, EocID } from 'CddaJsonFormat';
import { CharSkill } from './CharSkill';
import { SkillID } from './CddaJsonFormat/Skill';



/**角色事件列表 */
export const CharEvemtTypeList = [
    "CharIdle","CharMove","CharCauseHit","CharUpdate",
    "CharCauseMeleeHit","CharCauseRangeHit","CharInit",
    "CharTakeDamage","CharTakeRangeDamage","CharTakeMeleeDamage",
    "CharBattleUpdate",
] as const;
/**角色事件类型 */
export type CharEventType = typeof CharEvemtTypeList[number];

/**反转的角色事件列表
 * 对应同名GetDamage
 */
export const ReverseCharEvemtTypeList = [
    "CharCauseDamage","CharCauseMeleeDamage","CharCauseRangeDamage",
] as const;
/**反转的角色事件类型
 * 对应同名GetDamage
 */
export type ReverseCharEventType = typeof ReverseCharEvemtTypeList[number];

/**全局事件列表 */
export const GlobalEvemtTypeList = ["PlayerUpdate",...CharEvemtTypeList,...ReverseCharEvemtTypeList] as const;
/**全局事件 */
export type GlobalEventType = typeof GlobalEvemtTypeList[number];


/**变量属性 */
export type EnchStat = EnchGenericValType|EnchArmorValType;

/**动态读取的角色设定 */
export type CharConfig = {
    /**基础属性 */
    base_status:Record<StatusSimple,number>;
    /**基础技能 */
    base_skill?:Partial<Record<SkillID|"ALL",number>>;
    /**附魔属性 */
    ench_status?:Partial<Record<EnchStat,number>>;
    /**每级提升的附魔属性 */
    lvl_ench_status?:Partial<Record<EnchStat,number>>;
    /**固定的武器 */
    weapon:Gun|Generic;
    /**技能 */
    skill?:CharSkill[];
}


/**主资源表 */
export type DataTable={
    /**输出的角色数据表 */
    charTable:Record<string,{
        /**角色基础数据 */
        baseData:CharData;
        /**输出数据 */
        outData:Record<string,JArray>;
        /**输出的角色Eoc事件 u为角色 npc为未定义
         * id为 `${charName}_${etype}`
         */
        charEventEocs:Record<CharEventType,Eoc>;
        /**输出的对象反转的角色Eoc事件 u为目标 npc为角色
         * id为 `${charName}_${etype}`
         */
        reverseCharEventEocs:Record<ReverseCharEventType,Eoc>;
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
    target_gfxpack:string;
    /**游戏音效包目录名 */
    target_soundpack:string;
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

        await dm.processGfxpack();
        await dm.processSoundpack();
        return dm;
    }

    /**初始化 处理贴图包 */
    async processGfxpack(){
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
    }

    /**初始化 处理音效包 */
    async processSoundpack(){
        const bs = this.buildSetting;
        const dm = this;
        //删除旧的音效资源
        const soundPath = path.join(bs.game_path,'data','sound',bs.target_soundpack,'cnpc');
        await fs.promises.rm(soundPath, { recursive: true, force: true });

        //遍历角色
        for(const charName of dm.charList){
            //确认角色输出文件夹
            const charOutAudioFolder = path.join(soundPath,charName);
            await UtilFT.ensurePathExists(charOutAudioFolder,true);

            //遍历并找出所有音效文件夹
            const charAudioFolderPath = path.join(dm.getCharPath(charName),'audio');
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
                if(defineList.includes(audioFolderName as any)){
                    se.id = audioFolderName as SoundEffectID;
                    se.variant = (await dm.getCharData(charName)).baseData.baseWeaponID as SoundEffectVariantID;
                }
                await UtilFT.writeJSONFile(path.join(charOutAudioFolder,audioFolderName),[se]);
            }
        }
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
                baseEnchID          : genEnchantmentID(charName),
                baseWeaponID        : charConfig.weapon.id,
                baseWeaponGroupID   : genItemGroupID(`${charName}_WeaponGroup`),
                baseWeaponFlagID    : genFlagID(`${charName}_WeaponFlag`),
                deathEocID          : genEOCID(`${charName}_DeathProcess`),
            }

            //角色事件eoc主体
            const charEventEocs = CharEvemtTypeList.reduce((acc,etype)=>{
                const subEoc:Eoc={
                    type:"effect_on_condition",
                    eoc_type:"ACTIVATION",
                    id:genEOCID(`${charName}_${etype}`),
                    effect:[],
                    condition:{u_has_trait:baseData.baseMutID}
                }
                return {
                    ...acc,
                    [etype]:subEoc
            }},{} as Record<CharEventType,Eoc>)

            //角色反转事件eoc主体
            const reverseCharEventEocs = ReverseCharEvemtTypeList.reduce((acc,etype)=>{
                const subEoc:Eoc={
                    type:"effect_on_condition",
                    eoc_type:"ACTIVATION",
                    id:genEOCID(`${charName}_${etype}`),
                    effect:[],
                    condition:{npc_has_trait:baseData.baseMutID}
                }
                return {
                    ...acc,
                    [etype]:subEoc
            }},{} as Record<ReverseCharEventType,Eoc>)

            this.dataTable.charTable[charName] = {
                baseData,
                charEventEocs,
                reverseCharEventEocs,
                charConfig,
                outData:{},
            }
        }
        return this.dataTable.charTable[charName];
    }
    /**添加 eoc的ID引用到 全局事件
     * u为主角 npc为未定义
     */
    addEvent(etype:GlobalEventType,...events:Eoc[]){
        this.dataTable.eventEocs[etype].effect?.push(
            ...events.map(eoc=>({"run_eocs":eoc.id}))
        );
    }
    /**添加 eoc的ID引用到 角色事件
     * u为角色 npc为未定义
     */
    addCharEvent(charName:string,etype:CharEventType,...events:Eoc[]){
        this.dataTable.charTable[charName].charEventEocs[etype].effect?.push(
            ...events.map(eoc=>({"run_eocs":eoc.id}))
        );
    }
    /**添加 eoc的ID引用到 反转角色事件
     * u为目标 npc为角色
     */
    addReverseCharEvent(charName:string,etype:ReverseCharEventType,...events:Eoc[]){
        this.dataTable.charTable[charName].reverseCharEventEocs[etype].effect?.push(
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
            const charEventMap = Object.assign({},charData.charEventEocs,charData.reverseCharEventEocs);
            const charEventEocs:Eoc[]=[];
            for(const etypeStr in charEventMap){
                const etype = etypeStr as (CharEventType|ReverseCharEventType);
                const charEvent = charEventMap[etype];
                charEventEocs.push(charEvent);
                this.addEvent(etype,charEvent);
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
    /**基础装备附魔ID */
    baseEnchID : EnchantmentID;
    /**基础武器ID */
    baseWeaponID: GunID|GenericID;
    /**基础武器物品组ID */
    baseWeaponGroupID: ItemGroupID;
    /**基础武器Flag ID */
    baseWeaponFlagID: FlagID;
    /**死亡事件eoc ID */
    deathEocID: EocID;
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

