"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeImage = exports.getCharImagePath = void 0;
const Data_1 = require("./Data");
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
const AnimTool_1 = require("./AnimTool");
const Armor_1 = require("./CddaJsonFormat/Armor");
/**获取 角色图片目录 */
function getCharImagePath(charName) {
    return path.join(Data_1.DATA_PATH, charName, 'image');
}
exports.getCharImagePath = getCharImagePath;
/**合并并创建序列帧 */
async function mergeImage(charName) {
    const imagePath = getCharImagePath(charName);
    const info = await utils_1.UtilFT.loadJSONFile(path.join(imagePath, 'info'));
    const tmpInfo = [{
            "width": 32,
            "height": 32,
            "pixelscale": 1 //  Optional. Sets a multiplier for resizing a tileset. Defaults to 1.
        }];
    //处理动作
    const tmpPath = path.join(imagePath, 'tmp');
    const rawPath = path.join(tmpPath, 'raw');
    const mergePath = path.join(tmpPath, 'merge');
    for (const mtnName in info) {
        const animType = mtnName;
        const mtnInfo = info[animType];
        //检查是否有Idle动作
        if (mtnInfo == undefined && mtnName == "Idle")
            throw `${charName} 必须要有Idle动画`;
        if (mtnInfo == undefined)
            continue;
        const mtnPath = path.join(imagePath, mtnName);
        const animName = (0, AnimTool_1.formatAnimName)(charName, animType);
        //创建缓存文件夹
        const tmpMthPath = path.join(rawPath, `pngs_${animName}_${mtnInfo.sprite_width}x${mtnInfo.sprite_height}`);
        await utils_1.UtilFT.ensurePathExists(tmpMthPath, true);
        //复制数据到缓存
        await fs.promises.cp(mtnPath, tmpMthPath, { recursive: true });
        const { interval, ...rest } = mtnInfo;
        //检查图片 创建动画数据
        const animages = (await fs.promises.readdir(tmpMthPath))
            .filter(fileName => path.parse(fileName).ext == '.png')
            .sort((a, b) => {
            const amatch = a.match(new RegExp(mtnName + "(.*?)\\.png"));
            const bmatch = b.match(new RegExp(mtnName + "(.*?)\\.png"));
            if (amatch == null || bmatch == null)
                throw `文件名错误 path:${tmpMthPath} a:${a} b:${b}`;
            return parseInt(amatch[1]) - parseInt(bmatch[1]);
        })
            .map(fileName => ({ weight: (interval || 10), sprite: path.parse(fileName).name }));
        //写入动画数据
        await utils_1.UtilFT.writeJSONFile(path.join(tmpMthPath, animName), {
            id: `overlay_worn_${(0, Armor_1.genArmorID)(animName)}`,
            fg: animages,
            animated: true,
        });
        //添加主info
        tmpInfo.push({
            [animName + '.png']: {
                ...rest
            }
        });
    }
    //创建info
    await utils_1.UtilFT.writeJSONFile(path.join(rawPath, 'tile_info.json'), tmpInfo);
    const str = `NAME: ${charName}\n` +
        `VIEW: ${charName}\n` +
        `JSON: tile_config.json\n` +
        `TILESET: tiles.png`;
    await fs.promises.writeFile(path.join(rawPath, 'tileset.txt'), str);
    //打包
    await utils_1.UtilFT.ensurePathExists(mergePath, true);
    await utils_1.UtilFunc.exec(`py "tools/compose.py" "${rawPath}" "${mergePath}"`);
    //写入角色文件夹
    const tilesetNew = (await utils_1.UtilFT.loadJSONFile(path.join(mergePath, 'tile_config.json')))["tiles-new"]
        .filter(item => item.file != "fallback.png");
    const outCharImgPath = path.join((0, Data_1.getOutCharPath)(charName), 'image');
    await utils_1.UtilFT.ensurePathExists(outCharImgPath, true);
    await utils_1.UtilFT.writeJSONFile(path.join(outCharImgPath, "mod_tileset.json"), [{
            type: "mod_tileset",
            compatibility: ["MSX++DEAD_PEOPLE", "UNDEAD_PEOPLE", "UNDEAD_PEOPLE_BASE"],
            "tiles-new": tilesetNew,
        }]);
    //复制所有图片
    const pngs = (await fs.promises.readdir(mergePath))
        .filter(fileName => path.parse(fileName).ext == '.png');
    for (let pngName of pngs) {
        const pngPath = path.join(mergePath, pngName);
        const outPngPath = path.join(outCharImgPath, pngName);
        await fs.promises.copyFile(pngPath, outPngPath);
    }
}
exports.mergeImage = mergeImage;
