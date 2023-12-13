import { DataManager } from "@src/DataManager";
import * as path from "path";
import * as fs from "fs";
import { UtilFT, UtilFunc } from "@zwa73/utils";
import { PkgImageCfg, OverlayOrdering, PkgSpriteCfg, PkgTilesetCfg, PkgTilesetInfo, TilesetCfg } from "cdda-schema";
import { ModTileset } from "cdda-schema";




/**图片信息 */
type ImageInfo = {
    /**图片设定 */
    sprite:PkgSpriteCfg;
    /**图集设定 */
    tileset:PkgTilesetCfg;
};

//根据 PkgSpriteCfg 获得图片列表
function getImageFiles(cfg:PkgSpriteCfg):string[]{
    let subget = (imageCfg?:PkgImageCfg)=>{
        if(imageCfg===undefined) return [];
        let imageNames: string[] = [];

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
        } else if ('sprite' in imageCfg) {
            if (typeof imageCfg.sprite === 'string')
                imageNames.push(imageCfg.sprite);
            else
                imageNames.push(...imageCfg.sprite);
        }
        return imageNames;
    }
    return [...subget(cfg.fg),...subget(cfg.bg)];
}
//根据 PkgSpriteCfg 获得图集名
function getTilesetUID(cfg:PkgTilesetCfg):string{
    let W = cfg.sprite_width;
    let H = cfg.sprite_height;
    let result = `W${W}H${H}`;

    // 定义一个子函数来处理可选属性
    let concatSub = (shortName: string, value: number | undefined)=>{
        if (value !== undefined)
            result += `${shortName}${value}`;
    }
    // 使用子函数来处理每个可选属性
    concatSub('ox', cfg.sprite_offset_x);
    concatSub('oy', cfg.sprite_offset_y);
    concatSub('ps', cfg.pixelscale);
    concatSub('sa', cfg.sprites_across);

    return result;
}


/**合并图像 */
export async function mergeImage(dm:DataManager,charName:string,forcePackage:boolean=true){
    const {defineData,outData} = await dm.getCharData(charName);
    const imagePath = path.join(dm.getCharPath(charName),"image");
    if(!(await UtilFT.pathExists(imagePath))) return;

    const tmpPath = path.join(imagePath,"tmp");
    const rawPath = path.join(tmpPath,"raw");
    const mergePath = path.join(tmpPath,"merge");

    const tileSetMap:Record<string,PkgTilesetCfg> = {};

    //寻找图像配置
    const cfgFilepaths = Object.values(UtilFT.fileSearch(imagePath,/image\/[^/]+\.json/.source));
    for(const cfgPath of cfgFilepaths){
        const cfgJson:ImageInfo = (await UtilFT.loadJSONFile(cfgPath)) as ImageInfo;
        const tilesetcfg = cfgJson.tileset;
        //console.log("startlog")
        //console.log(cfgPath)
        //console.log(cfgJson)
        const pngs = getImageFiles(cfgJson.sprite);
        //移动到缓存
        const wxh = tilesetcfg.sprite_width+"x"+tilesetcfg.sprite_height;
        const uid = getTilesetUID(tilesetcfg);
        const tmpFolderPath = path.join(rawPath,`pngs_${uid}_${wxh}`);
        await UtilFT.ensurePathExists(tmpFolderPath,true);
        //复制png
        for(let pngName of pngs){
            pngName = pngName+".png";
            const pngPath = path.join(imagePath,pngName);
            const outPngPath = path.join(tmpFolderPath,pngName);
            await fs.promises.copyFile(pngPath,outPngPath);
        }
        //复制配置
        const cfgName = path.parse(cfgPath);
        await UtilFT.writeJSONFile(path.join(tmpFolderPath,cfgName.name),cfgJson.sprite);
        //注册入tileset表
        tileSetMap[uid] = tilesetcfg;
    }
    //创建tileset配置
    const rawinfo:PkgTilesetInfo=[{
            width:32,
            height:32,
            pixelscale:1
        },
        ...Object.keys(tileSetMap).map((uid)=>{
            return {
                [`${uid}.png`]:tileSetMap[uid]
            }
        })
    ]
    await UtilFT.writeJSONFile(path.join(rawPath,'tile_info.json'),rawinfo);
    const str = `NAME: ${charName}\n`     +
                `VIEW: ${charName}\n`     +
                `JSON: tile_config.json\n`+
                `TILESET: tiles.png`      ;
    await fs.promises.writeFile(path.join(rawPath,'tileset.txt'), str);
    //开始打包
    await UtilFT.ensurePathExists(mergePath,true);
    await UtilFunc.exec(`py "tools/compose.py" "${rawPath}" "${mergePath}"`);

    //读取打包结果
    const packageInfoPath = path.join(mergePath,'tile_config.json');
    const charImgPath = path.join(dm.getOutCharPath(charName),'image');
    await UtilFT.ensurePathExists(charImgPath,true);
    const tilesetNew = ((await UtilFT.loadJSONFile(packageInfoPath))["tiles-new"] as TilesetCfg[])
        .filter(item => item.file!="fallback.png");
    const imgModTileset:ModTileset = {
        type: "mod_tileset",
        compatibility: [dm.gameData.gfx_name!],
        "tiles-new": tilesetNew.map(item=>{
            item.file = path.join('chars',charName,'image',item.file)
            return item;
        }),
    }
    outData["image_tileset"] = [imgModTileset];
    //复制所有图片 到主目录
    const pngs = (await fs.promises.readdir(mergePath))
        .filter(fileName=> path.parse(fileName).ext=='.png');
    for(let pngName of pngs){
        const pngPath = path.join(mergePath,pngName);
        const outPngPath = path.join(charImgPath,pngName);
        await fs.promises.copyFile(pngPath,outPngPath);
    }
}