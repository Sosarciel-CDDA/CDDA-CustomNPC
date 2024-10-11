import { CDataManager } from "@src/DataManager";
import { Eoc, Generic } from "cdda-schema";
import { getCharCardId, getCharDisplayName, getCharInstanceId } from "./UtilGener";
import { CMDef } from "CMDefine";




export async function createCharGener(dm:CDataManager,charName:string) {
    const displayName = getCharDisplayName(charName);
    /**生成器ID */
    const spawnerId = `${charName}_Spawner`;
    /**生成器 */
    const charSpawner:Generic={
        type:"GENERIC",
        id:CMDef.genGenericID(spawnerId),
        name:{str_sp:`${displayName} 生成器`},
        description:`生成一个 ${displayName}`,
        use_action:{
            type:"effect_on_conditions",
            description:`生成一个 ${displayName}`,
            menu_text: `生成一个 ${displayName}`,
            effect_on_conditions:[CMDef.genEOCID(spawnerId)],
        },
        weight:1,
        volume:1,
        symbol: "O"
    }
    /**生成器EOC */
    const charSpawnerEoc: Eoc = {
        type: "effect_on_condition",
        eoc_type:"ACTIVATION",
        id: CMDef.genEOCID(spawnerId),
        effect: [
            //{ u_consume_item: CMDef.genGenericID(spawnerId), count: 1 },
            {
                u_spawn_npc: getCharInstanceId(charName),
                real_count: 1,
                min_radius: 1,
                max_radius: 1,
            },
        ],
    };

    //卡片冷却变量
    const cardcdvar = `${charName}_cooldown`;
    /**卡片EOC */
    const charCardEoc: Eoc = {
        type: "effect_on_condition",
        eoc_type:"ACTIVATION",
        id: CMDef.genEOCID(`${charName}_Card_Eoc`),
        effect: [
            {u_add_var:cardcdvar,time:true},
            {
                u_spawn_npc: getCharInstanceId(charName),
                real_count: 1,
                min_radius: 1,
                max_radius: 1,
            },
        ],
        condition:{or:[
            {math: [ `time_since(u_${cardcdvar})`, ">=", "time('1 d')" ] },
            {not:{compare_string: [ "yes", { u_val: cardcdvar } ] }}
        ]},
        false_effect:[{u_message:"卡片没什么反应, 等一会再试吧……"}]
    };
    /**卡片 */
    const charCard:Generic={
        type:"GENERIC",
        id:getCharCardId(charName),
        name:{str_sp:`${displayName} 卡片`},
        description:`召唤 ${displayName}`,
        use_action:{
            type:"effect_on_conditions",
            description:`召唤 ${displayName}`,
            menu_text:`召唤 ${displayName}`,
            effect_on_conditions:[charCardEoc.id],
        },
        flags:["UNBREAKABLE"],
        weight:1,
        volume:1,
        symbol: ",",
        looks_like: "memory_card"
    }
    dm.addCharData(charName,
        [charSpawner,charSpawnerEoc,charCardEoc,charCard],'gener');
}