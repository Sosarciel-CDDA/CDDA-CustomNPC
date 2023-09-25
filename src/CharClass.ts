import { Armor, BodyPartList, Eoc, Generic, Mutation, NPCClassBaseSkill, NpcClass, NpcInstance } from "CddaJsonFormat";
import { DataManager } from "./DataManager";
import { genEOCID, genGenericID, genItemGroupID, genMutationID } from "./ModDefine";
import { SkillID } from "./CddaJsonFormat/Skill";





/**创建角色职业和实例
 * @param charName 角色名
 */
export async function createCharClass(dm:DataManager,charName:string){
    const {baseData,outData,charConfig} = await dm.getCharData(charName);
    /**NPC职业 */
    const charClass:NpcClass={
        type:"npc_class",
        id:baseData.classID,
        name:charName,
        job_description:`${charName}专用的职业`,
        common: false,
        worn_override:genItemGroupID("EmptyGroup"),
        weapon_override:baseData.baseWeaponGroupID,
        carry_override:genItemGroupID("EmptyGroup"),
        skills:Object.entries(charConfig.base_skill||[]).reduce((acc,item)=>{
            if(item[1]==null) return acc;
            const skillid = item[0] as SkillID|"ALL";
            const skill:NPCClassBaseSkill={
                skill: skillid,
                level: {constant:item[1]}
            }
            return [...acc,skill];
        },[] as NPCClassBaseSkill[]),
        traits:[
            { "trait": baseData.baseMutID },
            { "trait": baseData.animData.Idle.mutID },
            { "trait": genMutationID("CnpcFlag") }]
    }
    /**NPC实例 */
    const charInstance:NpcInstance={
        type:"npc",
        id:baseData.instanceID,
        name_unique:charName,
        class:baseData.classID,
        faction:"your_followers",
        chat: "TALK_DONE",
        attitude:3,
        mission :0,
        str: charConfig.base_status.str,
        dex: charConfig.base_status.dex,
        int: charConfig.base_status.int,
        per: charConfig.base_status.per,
        death_eocs:["CNPC_EOC_NPC_DEATH"],
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
    const charSpawnerEoc: Eoc = {
		type: "effect_on_condition",
        eoc_type:"ACTIVATION",
		id: genEOCID(spawnerId),
		effect: [
			//{ u_consume_item: genGenericID(spawnerId), count: 1 },
			{
                u_spawn_npc: baseData.instanceID,
				real_count: 1,
				min_radius: 1,
				max_radius: 1,
			},
            {math:[`${charName}_IsAlive`,"=","1"]},
		],
        condition:{math:[`${charName}_IsAlive`,"<=","0"]}
	};

    /**死亡事件 */
    const charDeathEoc:Eoc = {
        type: "effect_on_condition",
        eoc_type:"ACTIVATION",
        id:genEOCID(`${charName}_DeathProcess`),
        effect:[
            {run_eoc_with:{
                id:genEOCID(`${charName}_DeathProcess_Sub`),
                eoc_type:"ACTIVATION",
                effect:[
                    {math:[`${charName}_IsAlive`,"=","0"]},
                    {u_location_variable:{global_val:"tmp_loc"},z_adjust:-10,z_override:true},
                    {u_teleport:{global_val:"tmp_loc"},force:true},
                    {npc_teleport:{global_val:"avater_loc"},force:true},
                ]
            },beta_loc:{global_val:"avater_loc"}}
        ]
    }
    dm.addCharEvent(charName,"CharDeath",-1000,charDeathEoc);
    outData['npc'] = [charClass,charInstance,charSpawner,charSpawnerEoc,charDeathEoc];
}