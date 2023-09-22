"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = exports.GlobalEvemtTypeList = exports.CharEvemtTypeList = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const StaticData_1 = require("./StaticData");
const AnimTool_1 = require("./AnimTool");
const ModDefine_1 = require("./ModDefine");
/**角色事件列表 */
exports.CharEvemtTypeList = [
    "CharIdle", "CharMove", "CharCauseHit", "CharUpdate",
    "CharCauseMeleeHit", "CharCauseRangeHit", "CharInit",
];
/**全局事件列表 */
exports.GlobalEvemtTypeList = ["PlayerUpdate", ...exports.CharEvemtTypeList];
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
    gameData = null;
    /**主资源表 */
    dataTable = {
        charTable: {},
        staticTable: {},
        eventEocs: exports.GlobalEvemtTypeList.reduce((acc, item) => {
            const subEoc = {
                type: "effect_on_condition",
                eoc_type: "ACTIVATION",
                id: (0, ModDefine_1.genEOCID)(item),
                effect: [],
            };
            return {
                ...acc,
                [item]: subEoc
            };
        }, {})
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
        //处理贴图包
        const gfxPath = path.join(bs.game_path, 'gfx', bs.target_gfx);
        const gfxTilesetTxtPath = path.join(gfxPath, 'tileset.txt');
        if (!(await utils_1.UtilFT.pathExists(gfxTilesetTxtPath)))
            throw "未找到目标贴图包自述文件 path:" + gfxTilesetTxtPath;
        const match = (await fs.promises.readFile(gfxTilesetTxtPath, "utf-8"))
            .match(/NAME: (.*?)$/m);
        if (match == null)
            throw "未找到目标贴图包NAME path:" + gfxTilesetTxtPath;
        dm.gameData = {
            gfx_name: match[1],
        };
        //读取贴图包设置备份 无则创建
        let tileConfig;
        if ((await utils_1.UtilFT.pathExists(path.join(gfxPath, 'tile_config_backup.json'))))
            tileConfig = await utils_1.UtilFT.loadJSONFile(path.join(gfxPath, 'tile_config_backup'));
        else {
            tileConfig = await utils_1.UtilFT.loadJSONFile(path.join(gfxPath, 'tile_config'));
            await utils_1.UtilFT.writeJSONFile(path.join(gfxPath, 'tile_config_backup'), tileConfig);
        }
        //寻找npc素体 并将ID改为变异素体
        let findMale = false;
        let findFemale = false;
        const fileObjList = tileConfig["tiles-new"];
        for (const fileObj of fileObjList) {
            const tilesList = fileObj.tiles;
            for (const tilesObj of tilesList) {
                if (tilesObj.id == "npc_female") {
                    tilesObj.id = `overlay_female_mutation_${(0, ModDefine_1.genMutationID)("BaseBody")}`;
                    findFemale = true;
                }
                else if (tilesObj.id == "npc_male") {
                    tilesObj.id = `overlay_male_mutation_${(0, ModDefine_1.genMutationID)("BaseBody")}`;
                    findMale = true;
                }
                if (findMale && findFemale)
                    break;
            }
            if (findMale && findFemale)
                break;
        }
        if (!(findMale && findFemale))
            console.log("未找到贴图包素体");
        await utils_1.UtilFT.writeJSONFile(path.join(gfxPath, 'tile_config'), tileConfig);
        return dm;
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
            const baseData = {
                charName: charName,
                baseMutID: (0, ModDefine_1.genMutationID)(charName),
                classID: (0, ModDefine_1.genNpcClassID)(charName),
                instanceID: (0, ModDefine_1.genNpcInstanceID)(charName),
                animData: animData,
                vaildAnim: [],
                baseArmorID: (0, ModDefine_1.genArmorID)(charName),
                baseEnchID: (0, ModDefine_1.genEnchantmentID)(charName),
                baseWeaponID: charConfig.weapon.id,
                baseWeaponGroupID: (0, ModDefine_1.genItemGroupID)(`${charName}Weapon`),
                baseWeaponFlagID: (0, ModDefine_1.genFlagID)(`${charName}Weapon`),
            };
            const charEventEocs = exports.CharEvemtTypeList.reduce((acc, item) => {
                const subEoc = {
                    type: "effect_on_condition",
                    eoc_type: "ACTIVATION",
                    id: (0, ModDefine_1.genEOCID)(`${item}_${charName}`),
                    effect: [],
                    condition: { u_has_trait: baseData.baseMutID }
                };
                return {
                    ...acc,
                    [item]: subEoc
                };
            }, {});
            this.dataTable.charTable[charName] = {
                baseData,
                charEventEocs,
                charConfig,
                outData: {},
            };
        }
        return this.dataTable.charTable[charName];
    }
    /**添加事件 */
    addEvent(etype, ...events) {
        this.dataTable.eventEocs[etype].effect?.push(...events.map(eoc => ({ "run_eocs": eoc.id })));
    }
    /**添加角色事件 */
    addCharEvent(charName, etype, ...events) {
        this.dataTable.charTable[charName].charEventEocs[etype].effect?.push(...events.map(eoc => ({ "run_eocs": eoc.id })));
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
            const charEvent = charData.charEventEocs;
            const charEventEocs = [];
            for (const etype in charEvent) {
                const et = etype;
                const ce = charEvent[et];
                charEventEocs.push(ce);
                this.addEvent(et, ce);
            }
            this.saveToCharFile(charName, 'char_event_eocs', charEventEocs);
            //复制角色静态数据
            const charStaticDataPath = path.join(this.getCharPath(charName), "StaticData");
            await utils_1.UtilFT.ensurePathExists(charStaticDataPath, true);
            //await
            fs.promises.cp(charStaticDataPath, this.getCharPath(charName), { recursive: true });
        }
        //导出全局EOC
        const globalEvent = this.dataTable.eventEocs;
        const eventEocs = [];
        for (const etype in globalEvent)
            eventEocs.push(globalEvent[etype]);
        this.saveToFile('event_eocs', eventEocs);
        //编译所有eocscript
        const { stdout, stderr } = await utils_1.UtilFunc.exec(`\"./tools/EocScript\" --input ${this.outPath} --output ${this.outPath}`);
        console.log(stdout);
    }
}
exports.DataManager = DataManager;
