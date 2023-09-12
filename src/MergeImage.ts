import { DATA_PATH, getCharPath, getOutCharPath } from "./Data";
import * as path from "path";
import * as fs from "fs";
import { JArray, UtilFT, UtilFunc } from "@zwa73/utils";
import { AnimType, formatAnimName } from "./AnimTool";
import { genArmorID } from "./CddaJsonFormat/Armor";

/**获取 角色图片目录 */
export function getCharImagePath(charName:string){
    return path.join(DATA_PATH,charName,'image');
}

/**动作图片信息 */
type ImageInfo = Partial<Record<AnimType,{
    /**图片宽度 */
	sprite_width: number;
    /**图片高度 */
	sprite_height: number;
	sprite_offset_x?: number;
	sprite_offset_y?: number;
	pixelscale?: number;
    /**帧动画间隔 */
    interval?:number;
}>>;

/**合并并创建序列帧 */
export async function mergeImage(charName:string){
    const imagePath = getCharImagePath(charName);
    const info = await UtilFT.loadJSONFile(path.join(imagePath,'info')) as ImageInfo;

    const tmpInfo:any[] = [{
        "width": 32,            // default sprite size
        "height": 32,
        "pixelscale": 1         //  Optional. Sets a multiplier for resizing a tileset. Defaults to 1.
    }];
    //处理动作
    const tmpPath = path.join(imagePath,'tmp');
    const rawPath = path.join(tmpPath,'raw');
    const mergePath = path.join(tmpPath,'merge');
    for(const mtnName in info){
        const animType = mtnName as AnimType;
        const mtnInfo = info[animType];

        //检查是否有Idle动作
        if(mtnInfo==undefined && mtnName=="Idle") throw `${charName} 必须要有Idle动画`;
        if(mtnInfo==undefined) continue;

        const mtnPath = path.join(imagePath,mtnName);
        const animName = formatAnimName(charName,animType);

        //创建缓存文件夹
        const tmpMthPath = path.join(rawPath,`pngs_${animName}_${mtnInfo.sprite_width}x${mtnInfo.sprite_height}`)
        await UtilFT.ensurePathExists(tmpMthPath,true);

        //复制数据到缓存
        await fs.promises.cp(mtnPath,tmpMthPath,{ recursive: true });
        const {interval,...rest} = mtnInfo;

        //检查图片 创建动画数据
        const animages = (await fs.promises.readdir(tmpMthPath))
            .filter(fileName=> path.parse(fileName).ext=='.png')
            .sort((a,b)=>{
                const amatch = a.match(new RegExp(mtnName+"(.*?)\\.png"));
                const bmatch = b.match(new RegExp(mtnName+"(.*?)\\.png"));
                if(amatch==null||bmatch==null)
                    throw `文件名错误 path:${tmpMthPath} a:${a} b:${b}`;
                return parseInt(amatch[1])-parseInt(bmatch[1]);
            })
            .map(fileName=>({weight:(interval||10),sprite:path.parse(fileName).name}));
        //写入动画数据
        await UtilFT.writeJSONFile(path.join(tmpMthPath,animName),{
            id:`overlay_worn_${genArmorID(animName)}`,
            fg:animages,
            animated: true,
        });
        //添加主info
        tmpInfo.push({
            [animName+'.png']:{
                ...rest
            }
        });
    }
    //创建info
    await UtilFT.writeJSONFile(path.join(rawPath,'tile_info.json'),tmpInfo);
    const str = `NAME: ${charName}\n`     +
                `VIEW: ${charName}\n`     +
                `JSON: tile_config.json\n`+
                `TILESET: tiles.png`      ;
    await fs.promises.writeFile(path.join(rawPath,'tileset.txt'), str);
    //打包
    await UtilFT.ensurePathExists(mergePath,true);
    await UtilFunc.exec(`py "tools/compose.py" "${rawPath}" "${mergePath}"`);

    //写入角色文件夹
    const tilesetNew = ((await UtilFT.loadJSONFile(path.join(mergePath,'tile_config.json')))["tiles-new"] as any[])
        .filter(item => item.file!="fallback.png");
    const outCharImgPath = path.join(getOutCharPath(charName),'image');
    await UtilFT.ensurePathExists(outCharImgPath,true);
    await UtilFT.writeJSONFile(path.join(outCharImgPath, "mod_tileset.json"), [{
		type: "mod_tileset",
		compatibility: ["MSX++DEAD_PEOPLE", "UNDEAD_PEOPLE", "UNDEAD_PEOPLE_BASE"],
		"tiles-new": tilesetNew,
	}]);
    //复制所有图片
    const pngs = (await fs.promises.readdir(mergePath))
        .filter(fileName=> path.parse(fileName).ext=='.png');
    for(let pngName of pngs){
        const pngPath = path.join(mergePath,pngName);
        const outPngPath = path.join(outCharImgPath,pngName);
        await fs.promises.copyFile(pngPath,outPngPath);
    }
}