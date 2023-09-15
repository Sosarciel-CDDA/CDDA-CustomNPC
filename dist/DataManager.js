"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = exports.EvemtTypeList = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const StaticData_1 = require("./StaticData");
const AnimTool_1 = require("./AnimTool");
const ModDefine_1 = require("./ModDefine");
/**事件列表 */
exports.EvemtTypeList = ["CharIdle", "CharMove", "CharCauseHit", "CharUpdate"];
class DataManager {
    /**资源目录 */
    dataPath = path.join(process.cwd(), 'data');
    /**输出目录 */
    outPath = path.join(process.cwd(), 'CustomNPC');
    /**角色目录 */
    charPath;
    /**角色列表 */
    charList;
    /**主资源表 */
    dataTable = {
        charTable: {},
        staticTable: {},
        eventEocs: exports.EvemtTypeList.reduce((acc, item) => {
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
    constructor(outPath, dataPath) {
        this.dataTable.staticTable = Object.assign({}, this.dataTable.staticTable, StaticData_1.StaticDataMap);
        this.outPath = outPath || this.outPath;
        this.dataPath = dataPath || this.dataPath;
        this.charPath = path.join(this.dataPath, 'chars');
        this.charList = fs.readdirSync(this.charPath).filter(fileName => {
            const filePath = this.getCharPath(fileName);
            if (fs.statSync(filePath).isDirectory())
                return true;
        });
    }
    /**获取角色表 如无则初始化 */
    getCharData(charName) {
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
            const baseData = {
                charName: charName,
                baseMutID: (0, ModDefine_1.genMutationID)(charName),
                classID: (0, ModDefine_1.genNpcClassID)(charName),
                instanceID: (0, ModDefine_1.genNpcInstanceID)(charName),
                animData: animData,
                vaildAnim: [],
                baseArmorID: (0, ModDefine_1.genArmorID)(charName),
                baseWeaponID: (0, ModDefine_1.genGenericID)(`${charName}Weapon`),
                baseAmmoID: (0, ModDefine_1.genAmmoID)(charName),
                baseAmmoTypeID: (0, ModDefine_1.genAmmiTypeID)(charName + "Ammo"),
                baseWeaponGroupID: (0, ModDefine_1.genItemGroupID)(`${charName}Weapon`),
            };
            this.dataTable.charTable[charName] = { baseData, outData: {} };
        }
        return this.dataTable.charTable[charName];
    }
    /**添加事件 */
    addEvent(etype, ...events) {
        this.dataTable.eventEocs[etype].effect?.push(...events.map(eoc => ({ "run_eocs": eoc.id })));
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
        //导出事件EOC
        const eventEocs = [];
        for (const etype in this.dataTable.eventEocs)
            eventEocs.push(this.dataTable.eventEocs[etype]);
        this.saveToFile('event_eocs', eventEocs);
        //导出角色数据
        for (let charName in this.dataTable.charTable) {
            const charOutData = this.dataTable.charTable[charName].outData;
            for (let key in charOutData) {
                let obj = charOutData[key];
                //await
                this.saveToCharFile(charName, key, obj);
            }
        }
    }
}
exports.DataManager = DataManager;
