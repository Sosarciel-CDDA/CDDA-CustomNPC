"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CddaJson = exports.CDataManager = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const StaticData_1 = require("./StaticData");
const CMDefine_1 = require("./CMDefine");
const cdda_event_1 = require("cdda-event");
const UtilGener_1 = require("./CharBuild/UtilGener");
/**数据管理器 */
class CDataManager extends cdda_event_1.DataManager {
    //———————————————————— 初始化 ————————————————————//
    constructor() {
        super(CMDefine_1.DATA_PATH, CMDefine_1.OUT_PATH, "CNPCEF");
        if (this._dataPath == null)
            throw "";
        //合并静态数据
        for (const key in StaticData_1.StaticDataMap)
            this.addData(StaticData_1.StaticDataMap[key], key);
    }
    /**添加 eoc的ID引用到 */
    addCharInvokeEoc(charName, etype, weight, ...events) {
        const effect = {
            if: { u_has_trait: (0, UtilGener_1.getCharMutId)(charName) },
            then: [{ run_eocs: [...events.map(eoc => eoc.id)] }]
        };
        super.addEvent(etype, weight, [effect]);
    }
    /**添加角色静态资源 */
    addCharData(charName, arr, filePath, ...filePaths) {
        super.addData(arr, path.join((0, CMDefine_1.getCharOutPath)(charName), filePath, ...filePaths));
    }
    /**输出数据 */
    async saveAllData() {
        super.saveAllData();
        //读取并处理角色
        const funcs = (await fs.promises.readdir(CMDefine_1.DATA_PATH))
            .filter(fileName => fs.statSync(path.join(CMDefine_1.DATA_PATH, fileName)).isDirectory())
            .map(charName => async () => {
            //复制角色静态数据
            const charStaticDataPath = path.join((0, CMDefine_1.getCharPath)(charName), "StaticData");
            await utils_1.UtilFT.ensurePathExists(charStaticDataPath, true);
            //await
            fs.promises.cp(charStaticDataPath, (0, CMDefine_1.getCharOutPathAbs)(charName), { recursive: true });
        });
        Promise.all([...funcs.map((func) => func())]);
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
