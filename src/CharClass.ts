import { genItemGroupID } from ".";
import { BodyPartList, EOC, Generic, Mutation, NpcClass, NpcInstance, genEOCID, genGenericID } from "./CddaJsonFormat";
import { DataManager } from "./DataManager";





/**创建角色职业和实例
 * @param charName 角色名
 */
export async function createCharClass(dm:DataManager,charName:string){
    const {baseData,outData} = dm.getCharData(charName);
    /**NPC职业 */
    const charClass:NpcClass={
        type:"npc_class",
        id:baseData.classID,
        name:charName,
        job_description:`${charName}专用的职业`,
        common: false,
        worn_override:genItemGroupID("EmptyGroup"),
        weapon_override:genItemGroupID("EmptyGroup"),
        carry_override:genItemGroupID("EmptyGroup"),
        traits:[{ "trait": baseData.baseMutID },{ "trait": baseData.animData.Idle.mutID }]
    }
    /**NPC实例 */
    const charInstance:NpcInstance={
        type:"npc",
        id:baseData.instanceID,
        name_unique:charName,
        class:baseData.classID,
        faction:"your_followers",
        chat: "TALK_DONE",
        attitude:0,
        mission:0,
    }
    /**生成器ID */
    const spawnerId = `${charName}_Spawner`;
    /**生成器 */
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
    /**生成器EOC */
    const charSpawnerEoc: EOC = {
		type: "effect_on_condition",
		id: genEOCID(spawnerId),
		effect: [
			//{ u_consume_item: genGenericID(spawnerId), count: 1 },
			{
                u_spawn_npc: baseData.instanceID,
				real_count: 1,
				min_radius: 1,
				max_radius: 1,
			},
		],
	};
    /**基础变异 */
    const baseMut:Mutation = {
        type            :"mutation",
        id              :baseData.baseMutID,
        name            :`${charName}的基础变异`,
        description     :`${charName}的基础变异`,
        points          :0,
        restricts_gear  : [...BodyPartList],
        remove_rigid    : [...BodyPartList],
    }
    outData['npc'] = [charClass,charInstance,baseMut,charSpawner,charSpawnerEoc];
}