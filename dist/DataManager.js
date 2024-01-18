"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CddaJson = exports.CDataManager = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const StaticData_1 = require("./StaticData");
const CharBuild_1 = require("./CharBuild");
const CnpcEvent_1 = require("./CnpcEvent");
const CMDefine_1 = require("./CMDefine");
const cdda_event_1 = require("cdda-event");
/**数据管理器 */
class CDataManager extends cdda_event_1.DataManager {
    /**角色目录 */
    charPath;
    /**角色列表 */
    charList;
    /**虚拟角色列表 */
    virtualCharList;
    /**build设置 */
    buildSetting = null;
    /**游戏数据 */
    gameData = {};
    /**输出的角色数据表 */
    charTable = {};
    /**输出的Eoc事件 */
    eventEocs = CnpcEvent_1.CGlobalHookList.reduce((acc, etype) => ({ ...acc, [etype]: [] }), {});
    //———————————————————— 初始化 ————————————————————//
    /**
     * @param dataPath 输入数据路径
     * @param outPath  输出数据路径
     */
    constructor(dataPath, outPath) {
        super(dataPath ?? path.join(process.cwd(), 'data'), outPath);
        if (this._dataPath == null)
            throw "";
        //合并静态数据
        for (const key in StaticData_1.StaticDataMap)
            this.addStaticData(StaticData_1.StaticDataMap[key], key);
        //初始化资源io路径
        this.charPath = path.join(this._dataPath, 'chars');
        //创建角色列表
        this.virtualCharList = [];
        this.charList = fs.readdirSync(this.charPath).filter(fileName => {
            const filePath = this.getCharPath(fileName);
            if (!fs.statSync(filePath).isDirectory())
                return false;
            const configFile = path.join(filePath, "config.json");
            if (!utils_1.UtilFT.pathExistsSync(configFile))
                return false;
            if (utils_1.UtilFT.loadJSONFileSync(configFile).virtual === true) {
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
    static async create(dataPath, outPath) {
        let dm = new CDataManager(dataPath, outPath);
        if (dm._dataPath == null)
            throw "";
        //读取build设置
        dm.buildSetting = (await utils_1.UtilFT.loadJSONFile(path.join(dm._dataPath, 'build_setting')));
        const bs = dm.buildSetting;
        dm._outPath = dm._outPath || path.join(bs.game_path, 'data', 'mods', 'CustomNPC');
        await dm.processGfxpack();
        await dm.processSoundpack();
        //await dm.processJson();
        return dm;
    }
    /**初始化 处理贴图包 */
    async processGfxpack() {
        const bs = this.buildSetting;
        const dm = this;
        //处理贴图包
        const gfxPath = path.join(bs.game_path, 'gfx', bs.target_gfxpack);
        const gfxTilesetTxtPath = path.join(gfxPath, 'tileset.txt');
        if (!(await utils_1.UtilFT.pathExists(gfxTilesetTxtPath)))
            throw "未找到目标贴图包自述文件 path:" + gfxTilesetTxtPath;
        const match = (await fs.promises.readFile(gfxTilesetTxtPath, "utf-8"))
            .match(/NAME: (.*?)$/m);
        if (match == null)
            throw "未找到目标贴图包NAME path:" + gfxTilesetTxtPath;
        //写入贴图名
        dm.gameData.gfx_name = match[1];
        //读取贴图包设置备份 无则创建
        let tileConfig;
        if ((await utils_1.UtilFT.pathExists(path.join(gfxPath, 'tile_config.json'))))
            tileConfig = await utils_1.UtilFT.loadJSONFile(path.join(gfxPath, 'tile_config.json'));
        else
            throw ("未找到贴图包 tile_config.json");
        //记录默认数据
        const defSet = tileConfig.tile_info[0];
        defSet.sprite_width = defSet.width;
        defSet.sprite_height = defSet.height;
        delete defSet.width;
        delete defSet.height;
        delete tileConfig.tile_info;
        //寻找npc素体 并将ID改为变异素体
        let findMale = false;
        let findFemale = false;
        //let count = 0;
        const fileObjList = tileConfig["tiles-new"];
        for (const fileObj of fileObjList) {
            const tilesList = fileObj.tiles;
            //载入默认数据
            for (const key in defSet) {
                if (fileObj[key] == null)
                    fileObj[key] = defSet[key];
            }
            //删除ascii
            if (fileObj.ascii)
                fileObj.ascii = [];
            //替换目录名
            if (fileObj.file)
                fileObj.file = path.join('..', '..', '..', 'gfx', bs.target_gfxpack, fileObj.file);
            fileObj.iso = undefined;
            fileObj.retract_dist_min = undefined;
            fileObj.retract_dist_max = undefined;
            //替换tiles
            fileObj.tiles = tilesList.filter(tilesObj => {
                if (tilesObj.id == "npc_female") {
                    tilesObj.id = `overlay_female_mutation_${CMDefine_1.CMDef.genMutationID("BaseBody")}`;
                    findFemale = true;
                    return true;
                }
                else if (tilesObj.id == "npc_male") {
                    tilesObj.id = `overlay_male_mutation_${CMDefine_1.CMDef.genMutationID("BaseBody")}`;
                    findMale = true;
                    return true;
                }
                return false;
            });
            //count++;
            //if(findMale&&findFemale) break;
        }
        //删除多余部分
        //tileConfig["tiles-new"] = (tileConfig["tiles-new"] as any[]).slice(0,count);
        if (!(findMale && findFemale))
            console.log("未找到贴图包素体");
        //设置基本属性
        tileConfig.compatibility = [dm.gameData.gfx_name];
        tileConfig.type = "mod_tileset";
        //写入mod文件夹
        await dm.saveToFile("modgfx_tileset.json", [tileConfig]);
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
                            { id: "npc_female", fg: 0, bg: 0 },
                            { id: "npc_male", fg: 0, bg: 0 },
                            { id: "CNPC_GENERIC_TransparentItem", fg: 0, bg: 0 },
                        ]
                    }],
            }]);
    }
    /**初始化 处理音效包 */
    async processSoundpack() {
        const bs = this.buildSetting;
        const dm = this;
        //删除旧的音效资源
        const soundPath = path.join(bs.game_path, 'data', 'sound', bs.target_soundpack, 'cnpc');
        await fs.promises.rm(soundPath, { recursive: true, force: true });
        //遍历角色
        const allchar = [...dm.charList, ...dm.virtualCharList];
        for (const charName of allchar) {
            //确认角色输出文件夹
            const charOutAudioFolder = path.join(soundPath, charName);
            await utils_1.UtilFT.ensurePathExists(charOutAudioFolder, true);
            //遍历并找出所有音效文件夹
            const charAudioFolderPath = path.join(dm.getCharPath(charName), 'audio');
            await utils_1.UtilFT.ensurePathExists(charAudioFolderPath, true);
            const charAudioList = (await fs.promises.readdir(charAudioFolderPath))
                .filter(fileName => fs.statSync(path.join(charAudioFolderPath, fileName)).isDirectory());
            //复制音效文件夹到输出
            for (const audioFolderName of charAudioList) {
                const charAudioPath = path.join(charAudioFolderPath, audioFolderName);
                const outAudioPath = path.join(charOutAudioFolder, audioFolderName);
                await fs.promises.cp(charAudioPath, outAudioPath, { recursive: true });
                //找到所有子音效
                const subAudio = (await fs.promises.readdir(charAudioPath))
                    .filter(fileName => [".ogg", ".wav"].includes(path.parse(fileName).ext));
                //创建音效配置 音效id为角色名 变体id为文件夹名 内容为子文件
                const se = {
                    type: "sound_effect",
                    id: charName,
                    variant: audioFolderName,
                    volume: 100,
                    files: [...subAudio.map(fileName => path.join('cnpc', charName, audioFolderName, fileName))]
                };
                //根据预留武器音效字段更改ID
                const defineList = [
                    "fire_gun", //枪械射击
                    "fire_gun_distant", //枪械射击 远距
                    "reload", //枪械装弹
                    "melee_hit_flesh", //近战攻击肉质
                    "melee_hit_metal", //近战攻击金属质
                    "melee_hit", //近战攻击
                ];
                //(武器id)_(类型)
                const defmatch = audioFolderName.match(/^(.+?)_(.+)$/);
                if (defmatch != null && defineList.includes(defmatch[2])) {
                    se.id = defmatch[2];
                    se.variant = defmatch[1];
                    //se.variant = (await dm.getCharData(charName)).charConfig.weapon?.id as SoundEffectVariantID;
                }
                await utils_1.UtilFT.writeJSONFile(path.join(charOutAudioFolder, audioFolderName), [se]);
            }
        }
    }
    /**载入所有json */
    async processJson() {
        const bs = this.buildSetting;
        const dm = this;
        const cddajson = await CddaJson.create(bs.game_path);
        dm.gameData.game_json = cddajson;
    }
    //———————————————————— 工具 ————————————————————//
    /**获取角色表 如无则初始化 */
    async getCharData(charName) {
        //初始化基础数据
        if (this.charTable[charName] == null) {
            const animData = CharBuild_1.AnimTypeList.map(animType => ({
                animType: animType,
                animName: (0, CharBuild_1.formatAnimName)(charName, animType),
                mutID: CMDefine_1.CMDef.genMutationID((0, CharBuild_1.formatAnimName)(charName, animType)),
                armorID: CMDefine_1.CMDef.genArmorID((0, CharBuild_1.formatAnimName)(charName, animType)),
                itemGroupID: CMDefine_1.CMDef.genItemGroupID((0, CharBuild_1.formatAnimName)(charName, animType)),
            })).reduce((acc, curr) => {
                acc[curr.animType] = curr;
                return acc;
            }, {});
            const charConfig = await (0, CharBuild_1.loadCharConfig)(this, charName);
            console.log(charConfig);
            const defineData = {
                charName: charName,
                baseMutID: CMDefine_1.CMDef.genMutationID(charName),
                classID: CMDefine_1.CMDef.genNpcClassID(charName),
                instanceID: CMDefine_1.CMDef.genNpcInstanceID(charName),
                animData: animData,
                validAnim: [],
                baseArmorID: CMDefine_1.CMDef.genArmorID(charName),
                baseEnchID: CMDefine_1.CMDef.genEnchantmentID(charName),
                baseItemFlagID: CMDefine_1.CMDef.genFlagID(`${charName}_WeaponFlag`),
                baseCarryGroup: CMDefine_1.CMDef.genItemGroupID(`${charName}_Carry`),
                talkTopicID: CMDefine_1.CMDef.genTalkTopicID(charName),
                cardID: CMDefine_1.CMDef.genGenericID(`${charName}_Card`),
                castResp: []
            };
            //角色事件eoc主体
            const charEventEocs = CnpcEvent_1.CCharHookList.reduce((acc, etype) => ({ ...acc, [etype]: [] }), {});
            this.charTable[charName] = {
                defineData,
                charEventEocs,
                charConfig,
                outData: {},
            };
        }
        return this.charTable[charName];
    }
    /**添加 eoc的ID引用到 全局事件
     * u为主角 npc为未定义
     */
    addGEvent(etype, weight, ...events) {
        this.eventEocs[etype].push(...events.map(eoc => ({ effect: { "run_eocs": [eoc.id] }, weight })));
    }
    /**添加 eoc的ID引用到 角色事件
     * u为角色 npc为未定义
     */
    addCharEvent(charName, etype, weight, ...events) {
        this.charTable[charName].charEventEocs[etype].push(...events.map(eoc => ({ effect: { "run_eocs": [eoc.id] }, weight })));
    }
    /**获取 角色目录 */
    getCharPath(charName) {
        return path.join(this.charPath, charName);
    }
    /**获取 输出角色目录 */
    getOutCharPath(charName) {
        if (this._outPath == null)
            throw "";
        return path.join(this._outPath, 'chars', charName);
    }
    //———————————————————— 输出 ————————————————————//
    /**输出数据到角色目录 */
    async saveToCharFile(charName, filePath, obj) {
        return utils_1.UtilFT.writeJSONFile(path.join(this.getOutCharPath(charName), filePath), obj);
    }
    /**输出数据 */
    async saveAllData() {
        super.saveAllData();
        function mergeEffects(effect) {
            const mergeeffects = [];
            effect.forEach((e) => {
                const lastobj = mergeeffects[mergeeffects.length - 1];
                if (typeof lastobj == "object" && 'run_eocs' in lastobj && Array.isArray(lastobj.run_eocs) &&
                    typeof e == "object" && 'run_eocs' in e && Array.isArray(e.run_eocs)) {
                    lastobj.run_eocs.push(...e.run_eocs);
                }
                else
                    mergeeffects.push(e);
            });
            return mergeeffects;
        }
        function pareEffects(events) {
            events = events.sort((a, b) => b.weight - a.weight);
            //展开合并
            const eventeffects = [];
            events.forEach((e) => eventeffects.push(e.effect));
            return mergeEffects(eventeffects);
        }
        //导出角色数据
        for (let charName of this.charList) {
            const charData = this.charTable[charName];
            const charOutData = charData.outData;
            for (let key in charOutData) {
                let obj = charOutData[key];
                //await
                this.saveToCharFile(charName, key, obj);
            }
            //导出角色EOC
            const charEventMap = Object.assign({}, charData.charEventEocs);
            const charEventEocs = [];
            //遍历事件类型
            for (const etypeStr in charEventMap) {
                const etype = etypeStr;
                //降序排序事件
                const charEventList = pareEffects(charEventMap[etype]);
                //至少有一个角色事件才会创建
                if (charEventList.length > 0) {
                    //创建角色触发Eoc
                    const eventEoc = {
                        type: "effect_on_condition",
                        eoc_type: "ACTIVATION",
                        id: CMDefine_1.CMDef.genEOCID(`${charName}_${etype}`),
                        effect: [...charEventList],
                        condition: { u_has_trait: charData.defineData.baseMutID }
                    };
                    charEventEocs.push(eventEoc);
                    //将角色触发eoc注册入全局eoc
                    this.addGEvent(etype, 0, eventEoc);
                }
            }
            this.saveToCharFile(charName, 'char_event_eocs', charEventEocs);
            //复制角色静态数据
            const charStaticDataPath = path.join(this.getCharPath(charName), "StaticData");
            await utils_1.UtilFT.ensurePathExists(charStaticDataPath, true);
            //await
            fs.promises.cp(charStaticDataPath, this.getOutCharPath(charName), { recursive: true });
        }
        //导出全局EOC
        const globalEvent = this.eventEocs;
        const eventEocs = [];
        for (const etypeStr in globalEvent) {
            const etype = etypeStr;
            //降序排序事件
            const globalEvents = pareEffects(globalEvent[etype]);
            //创建全局触发Eoc
            const globalEoc = {
                type: "effect_on_condition",
                eoc_type: "ACTIVATION",
                id: CMDefine_1.CMDef.genEOCID(etype),
                effect: [...globalEvents],
            };
            eventEocs.push(globalEoc);
        }
        this.saveToFile('event_eocs', eventEocs);
        //导出event框架
        this.saveToFile('event_frame', (0, CnpcEvent_1.buildEventFrame)());
        //编译所有eocscript
        const { stdout, stderr } = await utils_1.UtilFunc.exec(`\"./tools/EocScript\" --input ${this._outPath} --output ${this._outPath}`);
        console.log(stdout);
    }
}
exports.CDataManager = CDataManager;
/**所有json的表 */
class CddaJson {
    _table;
    _jsonList;
    constructor(table, jsonList) {
        this._table = table;
        this._jsonList = jsonList;
    }
    static async create(game_path) {
        //主表
        const table = {};
        //加载所有json
        const plist = [];
        const jsonFilePathList = Object.values(utils_1.UtilFT.fileSearchRegex(game_path, /\.json$/.source));
        jsonFilePathList.filter(filePath => !filePath.includes("CNPC"))
            .forEach(filePath => plist.push(utils_1.UtilFT.loadJSONFile(filePath)));
        const rawJsonList = await Promise.all(plist);
        //筛选有效json
        function processJson(json) {
            if (typeof json == "object" &&
                "type" in json &&
                "id" in json &&
                typeof json.id == "string")
                table[`${json.type}_${json.id}`] = json;
        }
        rawJsonList.forEach(item => {
            if (Array.isArray(item))
                item.forEach(subitem => processJson(subitem));
            else
                processJson(item);
        });
        const cddajson = new CddaJson(table, Object.values(table));
        return cddajson;
    }
    getJson(type, id) {
        return this._table[`${type}_${id}`];
    }
    jsonList() {
        return this._jsonList;
    }
}
exports.CddaJson = CddaJson;
