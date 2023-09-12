"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeImage = exports.getCharImagePath = void 0;
const Data_1 = require("./Data");
const Utyils_1 = require("./Utyils");
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
/**获取 角色图片目录 */
function getCharImagePath(charName) {
    return path.join(Data_1.DATA_PATH, charName, 'image');
}
exports.getCharImagePath = getCharImagePath;
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
    for (let mtnName in info) {
        let mtnInfo = info[mtnName];
        const mtnPath = path.join(imagePath, mtnName);
        const formatMtnName = charName + mtnName;
        const tmpMthPath = path.join(rawPath, `pngs_${formatMtnName}_${mtnInfo.sprite_width}x${mtnInfo.sprite_height}`);
        await utils_1.UtilFT.ensurePathExists(tmpMthPath, true);
        //复制到tmp
        await fs.promises.cp(mtnPath, tmpMthPath, { recursive: true });
        const { interval, ...rest } = mtnInfo;
        //检查图片 创建动态数据
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
        //创建动态数据
        await utils_1.UtilFT.writeJSONFile(path.join(tmpMthPath, formatMtnName), {
            id: formatMtnName,
            fg: animages,
            animated: true,
        });
        //添加info
        tmpInfo.push({
            [formatMtnName + '.png']: {
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
    await (0, Utyils_1.execAsync)(`py "tools/compose.py" "${rawPath}" "${mergePath}"`);
    //写入角色文件夹
    const tilesetNew = (await utils_1.UtilFT.loadJSONFile(path.join(mergePath, 'tile_config.json')))["tiles-new"]
        .filter(item => item.file != "fallback.png");
    const outCharPath = (0, Data_1.getOutCharPath)(charName);
    const outCharImgPath = path.join(outCharPath, 'image');
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
