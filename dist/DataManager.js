"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = exports.MOD_PREFIX = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const StaticData_1 = require("./StaticData");
const AnimTool_1 = require("./AnimTool");
const Mutattion_1 = require("./CddaJsonFormat/Mutattion");
const Item_1 = require("./CddaJsonFormat/Item");
const ItemGroup_1 = require("./CddaJsonFormat/ItemGroup");
const NpcClass_1 = require("./CddaJsonFormat/NpcClass");
const NpcInstance_1 = require("./CddaJsonFormat/NpcInstance");
/**mod物品前缀 */
exports.MOD_PREFIX = "CNPC";
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
                mutID: (0, Mutattion_1.genMutationID)((0, AnimTool_1.formatAnimName)(charName, animType)),
                armorID: (0, Item_1.genArmorID)((0, AnimTool_1.formatAnimName)(charName, animType)),
                itemGroupID: (0, ItemGroup_1.genItemGroupID)((0, AnimTool_1.formatAnimName)(charName, animType)),
            })).reduce((acc, curr) => {
                acc[curr.animType] = curr;
                return acc;
            }, {});
            const baseData = {
                charName: charName,
                baseMutID: (0, Mutattion_1.genMutationID)(charName),
                classID: (0, NpcClass_1.genNpcClassID)(charName),
                instanceID: (0, NpcInstance_1.genNpcInstanceID)(charName),
                animData: animData,
            };
            this.dataTable.charTable[charName] = { baseData, outData: {} };
        }
        return this.dataTable.charTable[charName];
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
