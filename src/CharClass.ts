import { formatAnimName } from "./AnimTool";
import { EOC, genEOCID } from "./CddaJsonFormat/EOC";
import { Generic, genGenericID } from "./CddaJsonFormat/Item";
import { genItemGroupID } from "./CddaJsonFormat/ItemGroup";
import { NpcClass, genNpcClassID } from "./CddaJsonFormat/NpcClass";
import { NpcInstance, genNpcInstanceID } from "./CddaJsonFormat/NpcInstance";
import { outCharFile } from "./DataManager";





/**创建角色职业和实例
 * @param charName 角色名
 */
export async function createCharClass(charName:string){
    const charClass:NpcClass={
        type:"npc_class",
        id:genNpcClassID(charName),
        name:charName,
        job_description:`${charName}专用的职业`,
        common: false,
        worn_override:genItemGroupID(formatAnimName(charName,"Idle"))
    }
    const charInstance:NpcInstance={
        type:"npc",
        id:genNpcInstanceID(charName),
        name_unique:charName,
        class:genNpcClassID(charName),
        faction:"your_followers",
        chat: "TALK_DONE",
        attitude:0,
        mission:0,
    }
    const spawnerId = `${charName}_Spawner`;
    const charSpawner:Generic={
        type:"GENERIC",
        id:genGenericID(spawnerId),
        name:`${charName}生成器`,
        description:`生成一个${charName}`,
        use_action:{
            type:"effect_on_conditions",
            description:`生成一个${charName}`,
            effect_on_conditions:[genEOCID(spawnerId)],
        },
        weight:1,
        volume:1,
        symbol: "O"
    }
    const charSpawnerEoc: EOC = {
		type: "effect_on_condition",
		id: genEOCID(spawnerId),
		effect: [
			//{ u_consume_item: genGenericID(spawnerId), count: 1 },
			{
                u_spawn_npc: genNpcInstanceID(charName),
				real_count: 1,
				min_radius: 1,
				max_radius: 1,
			},
		],
	};
    await outCharFile(charName,'npc.json',[charClass,charInstance,charSpawner,charSpawnerEoc]);
}