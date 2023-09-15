"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeImage = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
/**合并并创建序列帧 */
async function mergeImage(dm, charName) {
    const { baseData, outData } = dm.getCharData(charName);
    const imagePath = dm.getCharImagePath(charName);
    const info = await utils_1.UtilFT.loadJSONFile(path.join(imagePath, 'info'));
    const tmpInfo = [{
            "width": 32,
            "height": 32,
            "pixelscale": 1 //  Optional. Sets a multiplier for resizing a tileset. Defaults to 1.
        }];
    //处理动作
    const tmpPath = path.join(imagePath, 'tmp');
    //删除缓存
    await fs.promises.rm(tmpPath, { recursive: true, force: true });
    const rawPath = path.join(tmpPath, 'raw');
    const mergePath = path.join(tmpPath, 'merge');
    for (const mtnName in info) {
        const animType = mtnName;
        const mtnInfo = info[animType];
        const animData = baseData.animData[animType];
        //检查是否有Idle动作
        if (mtnInfo == undefined && animType == "Idle")
            throw `${charName} 必须要有Idle动画`;
        if (mtnInfo == undefined)
            continue;
        const mtnPath = path.join(imagePath, mtnName);
        const animName = animData.animName;
        //创建缓存文件夹
        const tmpMthPath = path.join(rawPath, `pngs_${animName}_${mtnInfo.sprite_width}x${mtnInfo.sprite_height}`);
        await utils_1.UtilFT.ensurePathExists(tmpMthPath, true);
        //复制数据到缓存
        await fs.promises.cp(mtnPath, tmpMthPath, { recursive: true });
        const { interval, format_regex, ...rest } = mtnInfo;
        //检查图片 创建动画数据
        const animages = (await fs.promises.readdir(tmpMthPath))
            .filter(fileName => path.parse(fileName).ext == '.png')
            .sort((a, b) => {
            const regStr = format_regex || (mtnName + "(.*)\\.png");
            const amatch = a.match(new RegExp(regStr));
            const bmatch = b.match(new RegExp(regStr));
            if (amatch == null || bmatch == null)
                throw `文件名错误 path:${tmpMthPath} a:${a} b:${b}`;
            return parseInt(amatch[1]) - parseInt(bmatch[1]);
        })
            .map(fileName => ({ weight: (interval || 10), sprite: path.parse(fileName).name }));
        //写入动画数据
        await utils_1.UtilFT.writeJSONFile(path.join(tmpMthPath, animName), {
            id: `overlay_worn_${animData.armorID}`,
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
    //写入 mod贴图设置 到角色文件夹
    const tilesetNew = (await utils_1.UtilFT.loadJSONFile(path.join(mergePath, 'tile_config.json')))["tiles-new"]
        .filter(item => item.file != "fallback.png");
    outData["mod_tileset"] = [{
            type: "mod_tileset",
            compatibility: ["MSX++DEAD_PEOPLE", "UNDEAD_PEOPLE", "UNDEAD_PEOPLE_BASE"],
            "tiles-new": tilesetNew,
        }];
    //复制所有图片 到主目录
    const pngs = (await fs.promises.readdir(mergePath))
        .filter(fileName => path.parse(fileName).ext == '.png');
    for (let pngName of pngs) {
        const pngPath = path.join(mergePath, pngName);
        const outPngPath = path.join(dm.outPath, pngName);
        await fs.promises.copyFile(pngPath, outPngPath);
    }
}
exports.mergeImage = mergeImage;
