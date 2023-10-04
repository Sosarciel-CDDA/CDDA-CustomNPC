"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CddaJson = exports.DataManager = exports.GlobalEvemtTypeList = exports.ReverseCharEvemtTypeList = exports.CharEvemtTypeList = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const StaticData_1 = require("./StaticData");
const AnimTool_1 = require("./AnimTool");
const ModDefine_1 = require("./ModDefine");
/**角色事件列表 */
exports.CharEvemtTypeList = [
    "CharIdle",
    "CharMove",
    "CharCauseHit",
    "CharUpdate",
    "CharCauseMeleeHit",
    "CharCauseRangeHit",
    "CharInit",
    "CharTakeDamage",
    "CharTakeRangeDamage",
    "CharTakeMeleeDamage",
    "CharBattleUpdate",
    "CharDeath", //角色 死亡
];
/**反转Talker的角色事件列表
 * 对应同名CauseDamage
 * npc为角色
 */
exports.ReverseCharEvemtTypeList = [
    "CharCauseDamage",
    "CharCauseMeleeDamage",
    "CharCauseRangeDamage", //u为受害者
];
/**全局事件列表 */
exports.GlobalEvemtTypeList = ["PlayerUpdate", ...exports.CharEvemtTypeList, ...exports.ReverseCharEvemtTypeList];
class DataManager {
    /**资源目录 */
    dataPath = path.join(process.cwd(), 'data');
    /**输出目录 */
    outPath; // = path.join(process.cwd(),'CustomNPC');
    /**角色目录 */
    charPath;
    /**角色列表 */
    charList;
    /**build设置 */
    buildSetting = null;
    /**游戏数据 */
    gameData = {};
    /**主资源表 */
    dataTable = {
        charTable: {},
        staticTable: {},
        eventEocs: exports.GlobalEvemtTypeList.reduce((acc, etype) => ({ ...acc, [etype]: [] }), {})
    };
    /**
     * @param dataPath 输入数据路径
     * @param outPath  输出数据路径
     */
    constructor(dataPath, outPath) {
        //合并静态数据
        this.dataTable.staticTable = Object.assign({}, this.dataTable.staticTable, StaticData_1.StaticDataMap);
        //初始化资源io路径
        this.outPath = outPath;
        this.dataPath = dataPath || this.dataPath;
        this.charPath = path.join(this.dataPath, 'chars');
        this.charList = fs.readdirSync(this.charPath).filter(fileName => {
            const filePath = this.getCharPath(fileName);
            if (fs.statSync(filePath).isDirectory())
                return true;
        });
    }
    /**静态构造函数
     * @param dataPath 输入数据路径
     * @param outPath  输出数据路径
     */
    static async create(dataPath, outPath) {
        let dm = new DataManager(dataPath, outPath);
        //读取build设置
        dm.buildSetting = (await utils_1.UtilFT.loadJSONFile(path.join(dm.dataPath, 'build_setting')));
        const bs = dm.buildSetting;
        dm.outPath = dm.outPath || path.join(bs.game_path, 'data', 'mods', 'CustomNPC');
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
            //替换tiles
            fileObj.tiles = tilesList.filter(tilesObj => {
                if (tilesObj.id == "npc_female") {
                    tilesObj.id = `overlay_female_mutation_${(0, ModDefine_1.genMutationID)("BaseBody")}`;
                    findFemale = true;
                    return true;
                }
                else if (tilesObj.id == "npc_male") {
                    tilesObj.id = `overlay_male_mutation_${(0, ModDefine_1.genMutationID)("BaseBody")}`;
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
        for (const charName of dm.charList) {
            //确认角色输出文件夹
            const charOutAudioFolder = path.join(soundPath, charName);
            await utils_1.UtilFT.ensurePathExists(charOutAudioFolder, true);
            //遍历并找出所有音效文件夹
            const charAudioFolderPath = path.join(dm.getCharPath(charName), 'audio');
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
                    "fire_gun",
                    "fire_gun_distant",
                    "reload",
                    "melee_hit_flesh",
                    "melee_hit_metal",
                    "melee_hit", //近战攻击
                ];
                if (defineList.includes(audioFolderName)) {
                    se.id = audioFolderName;
                    se.variant = (await dm.getCharData(charName)).defineData.baseWeaponID;
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
    /**获取角色表 如无则初始化 */
    async getCharData(charName) {
        //初始化基础数据
        if (this.dataTable.charTable[charName] == null) {
            const animData = AnimTool_1.AnimTypeList.map(animType => ({
                animType: animType,
                animName: (0, AnimTool_1.formatAnimName)(charName, animType),
                mutID: (0, ModDefine_1.genMutationID)((0, AnimTool_1.formatAnimName)(charName, animType)),
                armorID: (0, ModDefine_1.genArmorID)((0, AnimTool_1.formatAnimName)(charName, animType)),
                itemGroupID: (0, ModDefine_1.genItemGroupID)((0, AnimTool_1.formatAnimName)(charName, animType)),
            })).reduce((acc, curr) => {
                acc[curr.animType] = curr;
                return acc;
            }, {});
            const charConfig = await utils_1.UtilFT.loadJSONFile(path.join(this.getCharPath(charName), 'config'));
            console.log(charConfig);
            const defineData = {
                charName: charName,
                baseMutID: (0, ModDefine_1.genMutationID)(charName),
                classID: (0, ModDefine_1.genNpcClassID)(charName),
                instanceID: (0, ModDefine_1.genNpcInstanceID)(charName),
                animData: animData,
                vaildAnim: [],
                baseArmorID: (0, ModDefine_1.genArmorID)(charName),
                baseEnchID: (0, ModDefine_1.genEnchantmentID)(charName),
                baseWeaponID: charConfig.weapon.id,
                baseWeaponGroupID: (0, ModDefine_1.genItemGroupID)(`${charName}_WeaponGroup`),
                baseWeaponFlagID: (0, ModDefine_1.genFlagID)(`${charName}_WeaponFlag`),
                expVarID: `${charName}_exp`,
                talkTopicID: (0, ModDefine_1.genTalkTopicID)(charName),
            };
            //角色事件eoc主体
            const charEventEocs = exports.CharEvemtTypeList.reduce((acc, etype) => ({ ...acc, [etype]: [] }), {});
            //角色反转事件eoc主体
            const reverseCharEventEocs = exports.ReverseCharEvemtTypeList.reduce((acc, etype) => ({ ...acc, [etype]: [] }), {});
            this.dataTable.charTable[charName] = {
                defineData,
                charEventEocs,
                reverseCharEventEocs,
                charConfig,
                outData: {},
            };
        }
        return this.dataTable.charTable[charName];
    }
    /**添加 eoc的ID引用到 全局事件
     * u为主角 npc为未定义
     */
    addEvent(etype, weight, ...events) {
        this.dataTable.eventEocs[etype].push(...events.map(eoc => ({ effect: { "run_eocs": eoc.id }, weight })));
    }
    /**添加 eoc的ID引用到 角色事件
     * u为角色 npc为未定义
     */
    addCharEvent(charName, etype, weight, ...events) {
        this.dataTable.charTable[charName].charEventEocs[etype].push(...events.map(eoc => ({ effect: { "run_eocs": eoc.id }, weight })));
    }
    /**添加 eoc的ID引用到 反转角色事件
     * u为目标 npc为角色
     */
    addReverseCharEvent(charName, etype, weight, ...events) {
        this.dataTable.charTable[charName].reverseCharEventEocs[etype].push(...events.map(eoc => ({ effect: { "run_eocs": eoc.id }, weight })));
    }
    /**获取 角色目录 */
    getCharPath(charName) {
        return path.join(this.charPath, charName);
    }
    /**获取 角色图片目录 */
    getCharImagePath(charName) {
        return path.join(this.getCharPath(charName), 'image');
    }
    /**获取 输出角色目录 */
    getOutCharPath(charName) {
        return path.join(this.outPath, 'chars', charName);
    }
    /**输出数据到角色目录 */
    async saveToCharFile(charName, filePath, obj) {
        return utils_1.UtilFT.writeJSONFile(path.join(this.getOutCharPath(charName), filePath), obj);
    }
    /**输出数据到主目录 */
    async saveToFile(filePath, obj) {
        return utils_1.UtilFT.writeJSONFile(path.join(this.outPath, filePath), obj);
    }
    /**输出数据 */
    async saveAllData() {
        //复制静态数据
        const staticDataPath = path.join(this.dataPath, "StaticData");
        utils_1.UtilFT.ensurePathExists(staticDataPath, true);
        //await
        fs.promises.cp(staticDataPath, this.outPath, { recursive: true });
        //导出js静态数据
        const staticData = this.dataTable.staticTable;
        for (let key in staticData) {
            let obj = staticData[key];
            //await
            this.saveToFile(key, obj);
        }
        //导出角色数据
        for (let charName in this.dataTable.charTable) {
            const charData = this.dataTable.charTable[charName];
            const charOutData = charData.outData;
            for (let key in charOutData) {
                let obj = charOutData[key];
                //await
                this.saveToCharFile(charName, key, obj);
            }
            //导出角色EOC
            const charEventMap = Object.assign({}, charData.charEventEocs, charData.reverseCharEventEocs);
            const charEventEocs = [];
            for (const etypeStr in charEventMap) {
                const etype = etypeStr;
                //降序排序事件
                const charEvent = charEventMap[etype].sort((a, b) => b.weight - a.weight);
                //至少有一个角色事件才会创建
                if (charEvent.length > 0) {
                    //创建角色触发Eoc
                    const eventEoc = {
                        type: "effect_on_condition",
                        eoc_type: "ACTIVATION",
                        id: (0, ModDefine_1.genEOCID)(`${charName}_${etype}`),
                        effect: [...charEvent.map(event => event.effect)],
                        condition: exports.CharEvemtTypeList.includes(etype)
                            ? { u_has_trait: charData.defineData.baseMutID }
                            : { npc_has_trait: charData.defineData.baseMutID }
                    };
                    charEventEocs.push(eventEoc);
                    //将角色触发eoc注册入全局eoc
                    this.addEvent(etype, 0, eventEoc);
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
        const globalEvent = this.dataTable.eventEocs;
        const eventEocs = [];
        for (const etype in globalEvent) {
            //降序排序事件
            const globalEvents = globalEvent[etype].sort((a, b) => b.weight - a.weight);
            //创建全局触发Eoc
            const globalEoc = {
                type: "effect_on_condition",
                eoc_type: "ACTIVATION",
                id: (0, ModDefine_1.genEOCID)(etype),
                effect: [...globalEvents.map(event => event.effect)],
            };
            eventEocs.push(globalEoc);
        }
        this.saveToFile('event_eocs', eventEocs);
        //编译所有eocscript
        const { stdout, stderr } = await utils_1.UtilFunc.exec(`\"./tools/EocScript\" --input ${this.outPath} --output ${this.outPath}`);
        console.log(stdout);
    }
}
exports.DataManager = DataManager;
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
        const jsonFilePathList = Object.values(utils_1.UtilFT.fileSearch(game_path, /\.json$/.source));
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
