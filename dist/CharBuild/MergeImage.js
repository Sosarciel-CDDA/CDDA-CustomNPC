"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeImage = void 0;
const path = require("path");
const fs = require("fs");
const utils_1 = require("@zwa73/utils");
//根据 PkgSpriteCfg 获得图片列表
function getImageFiles(cfg) {
    let subget = (imageCfg) => {
        if (imageCfg === undefined)
            return [];
        let imageNames = [];
        if (typeof imageCfg === 'string')
            imageNames.push(imageCfg);
        else if (Array.isArray(imageCfg)) {
            for (let item of imageCfg) {
                if (typeof item === 'string')
                    imageNames.push(item);
                else if ('sprite' in item) {
                    if (typeof item.sprite === 'string')
                        imageNames.push(item.sprite);
                    else
                        imageNames.push(...item.sprite);
                }
            }
        }
        else if ('sprite' in imageCfg) {
            if (typeof imageCfg.sprite === 'string')
                imageNames.push(imageCfg.sprite);
            else
                imageNames.push(...imageCfg.sprite);
        }
        return imageNames;
    };
    return [...subget(cfg.fg), ...subget(cfg.bg)];
}
//根据 PkgSpriteCfg 获得图集名
function getTilesetUID(cfg) {
    let W = cfg.sprite_width;
    let H = cfg.sprite_height;
    let result = `W${W}H${H}`;
    // 定义一个子函数来处理可选属性
    let concatSub = (shortName, value) => {
        if (value !== undefined)
            result += `${shortName}${value}`;
    };
    // 使用子函数来处理每个可选属性
    concatSub('ox', cfg.sprite_offset_x);
    concatSub('oy', cfg.sprite_offset_y);
    concatSub('ps', cfg.pixelscale);
    concatSub('sa', cfg.sprites_across);
    return result;
}
/**合并图像 */
async function mergeImage(dm, charName, forcePackage = true) {
    const { defineData, outData } = await dm.getCharData(charName);
    const imagePath = path.join(dm.getCharPath(charName), "image");
    if (!(await utils_1.UtilFT.pathExists(imagePath)))
        return;
    const tmpPath = path.join(imagePath, "tmp");
    const rawPath = path.join(tmpPath, "raw");
    const mergePath = path.join(tmpPath, "merge");
    const tileSetMap = {};
    //寻找图像配置
    const cfgFilepaths = Object.values(utils_1.UtilFT.fileSearch(imagePath, /image\/[^/]+\.json/.source));
    for (const cfgPath of cfgFilepaths) {
        const cfgJson = (await utils_1.UtilFT.loadJSONFile(cfgPath));
        const tilesetcfg = cfgJson.tileset;
        //console.log("startlog")
        //console.log(cfgPath)
        //console.log(cfgJson)
        const pngs = getImageFiles(cfgJson.sprite);
        //移动到缓存
        const wxh = tilesetcfg.sprite_width + "x" + tilesetcfg.sprite_height;
        const uid = getTilesetUID(tilesetcfg);
        const tmpFolderPath = path.join(rawPath, `pngs_${uid}_${wxh}`);
        await utils_1.UtilFT.ensurePathExists(tmpFolderPath, true);
        //复制png
        for (let pngName of pngs) {
            pngName = pngName + ".png";
            const pngPath = path.join(imagePath, pngName);
            const outPngPath = path.join(tmpFolderPath, pngName);
            await fs.promises.copyFile(pngPath, outPngPath);
        }
        //复制配置
        const cfgName = path.parse(cfgPath);
        await utils_1.UtilFT.writeJSONFile(path.join(tmpFolderPath, cfgName.name), cfgJson.sprite);
        //注册入tileset表
        tileSetMap[uid] = tilesetcfg;
    }
    //创建tileset配置
    const rawinfo = [{
            width: 32,
            height: 32,
            pixelscale: 1
        },
        ...Object.keys(tileSetMap).map((uid) => {
            return {
                [`${uid}.png`]: tileSetMap[uid]
            };
        })
    ];
    await utils_1.UtilFT.writeJSONFile(path.join(rawPath, 'tile_info.json'), rawinfo);
    const str = `NAME: ${charName}\n` +
        `VIEW: ${charName}\n` +
        `JSON: tile_config.json\n` +
        `TILESET: tiles.png`;
    await fs.promises.writeFile(path.join(rawPath, 'tileset.txt'), str);
    //开始打包
    await utils_1.UtilFT.ensurePathExists(mergePath, true);
    await utils_1.UtilFunc.exec(`py "tools/compose.py" "${rawPath}" "${mergePath}"`);
    //读取打包结果
    const packageInfoPath = path.join(mergePath, 'tile_config.json');
    const charImgPath = path.join(dm.getOutCharPath(charName), 'image');
    await utils_1.UtilFT.ensurePathExists(charImgPath, true);
    const tilesetNew = (await utils_1.UtilFT.loadJSONFile(packageInfoPath))["tiles-new"]
        .filter(item => item.file != "fallback.png");
    const imgModTileset = {
        type: "mod_tileset",
        compatibility: [dm.gameData.gfx_name],
        "tiles-new": tilesetNew.map(item => {
            item.file = path.join('chars', charName, 'image', item.file);
            return item;
        }),
    };
    outData["image_tileset"] = [imgModTileset];
    //复制所有图片 到主目录
    const pngs = (await fs.promises.readdir(mergePath))
        .filter(fileName => path.parse(fileName).ext == '.png');
    for (let pngName of pngs) {
        const pngPath = path.join(mergePath, pngName);
        const outPngPath = path.join(charImgPath, pngName);
        await fs.promises.copyFile(pngPath, outPngPath);
    }
}
exports.mergeImage = mergeImage;
