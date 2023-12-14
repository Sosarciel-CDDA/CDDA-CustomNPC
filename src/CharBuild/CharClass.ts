import { Armor, BodyPartList, Eoc, EocEffect, Generic, Mutation, MutationID, NPCClassBaseSkill, NpcClass, NpcInstance } from "cdda-schema";
import { DataManager } from "../DataManager";
import { genEOCID, genGenericID, genItemGroupID, genMutationID } from "ModDefine";
import { DefineSkillList, SkillID } from "cdda-schema";
import { EMPTY_GROUP_ID } from "StaticData";





/**创建角色职业和实例  
 * @param charName 角色名  
 */
export async function createCharClass(dm:DataManager,charName:string){
    const {defineData,outData,charConfig} = await dm.getCharData(charName);
    const displayName = charName.replaceAll("_"," ");
    /**NPC职业 */
    const charClass:NpcClass={
        type:"npc_class",
        id:defineData.classID,
        name:displayName,
        job_description:`${displayName}专用的职业`,
        common: false,
        worn_override:EMPTY_GROUP_ID,
        weapon_override:EMPTY_GROUP_ID,
        carry_override:defineData.baseCarryGroup,
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
            { "trait": genMutationID("CnpcFlag") },
            { "trait": defineData.baseMutID },
            ...(charConfig.base_mutation??[])
                .map(mut=>({trait:mut})),
            ...(defineData.validAnim.length>=1
            ? [{ "trait": defineData.animData.Idle.mutID },{"trait":"TOUGH_FEET" as MutationID}]
            : [{ "trait": genMutationID("NoAnim") }])]
    }
    /**NPC实例 */
    const charInstance:NpcInstance={
        type:"npc",
        id:defineData.instanceID,
        name_unique:displayName,
        class:defineData.classID,
        faction:"your_followers",
        chat: "TALK_DONE",
        attitude:3,
        mission :0,
        str: charConfig.base_status?.str || 10,
        dex: charConfig.base_status?.dex || 10,
        int: charConfig.base_status?.int || 10,
        per: charConfig.base_status?.per || 10,
        height  :charConfig.desc?.height,
        age     :charConfig.desc?.age   ,
        gender  :charConfig.desc?.gender,
    }

    /**生成器ID */
    const spawnerId = `${charName}_Spawner`;
    /**生成器 */
    const charSpawner:Generic={
        type:"GENERIC",
        id:genGenericID(spawnerId),
        name:{str_sp:`${displayName} 生成器`},
        description:`生成一个 ${displayName}`,
        use_action:{
            type:"effect_on_conditions",
            description:`生成一个 ${displayName}`,
            menu_text: `生成一个 ${displayName}`,
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
            {math:[`${charName}_uid`,"+=","1"]},
            {
                u_spawn_npc: defineData.instanceID,
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
        id: genEOCID(`${charName}_Card_Eoc`),
        effect: [
            {u_add_var:cardcdvar,time:true},
            {math:[`${charName}_uid`,"+=","1"]},
            {
                u_spawn_npc: defineData.instanceID,
                real_count: 1,
                min_radius: 1,
                max_radius: 1,
            },
        ],
        condition:{or:[
            {u_compare_time_since_var:cardcdvar,op:">=",time:"1 d"},
            {not:{u_has_var:cardcdvar,time:true}}
        ]},
        false_effect:[{u_message:"卡片没什么反应, 等一会再试吧……"}]
    };
    /**卡片 */
    const charCard:Generic={
        type:"GENERIC",
        id:defineData.cardID,
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

    /**自动保存事件 */
    const autoSave:Eoc = {
        type:"effect_on_condition",
        id:genEOCID(`${charName}_SaveProcess`),
        eoc_type:"ACTIVATION",
        effect:[
            ...DefineSkillList.map(item=>{
                const math:EocEffect = {math:[`${charName}_skill_${item}`,"=",`u_skill(${item})`]};
                return math;
            })
        ]
    }
    dm.addCharEvent(charName,"SlowUpdate",0,autoSave);


    /**初始化事件 */
    const charInitEoc:Eoc = {
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:genEOCID(`${charName}_InitProcess`),
        effect:[
            {math:[`u_uid`,"=",`${charName}_uid`]},
            ...DefineSkillList.map(item=>{
                const math:EocEffect = {math:[`u_skill(${item})`,"=",`${charName}_skill_${item}`]};
                return math;
            })
        ]
    }
    dm.addCharEvent(charName,"Init",1000,charInitEoc);

    /**销毁事件 */
    const charRemoveEoc:Eoc = {
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:genEOCID(`${charName}_RemoveProcess`),
        effect:[
            {run_eocs:"CNPC_EOC_CnpcDeathProcess"}
        ],
        condition:{math:["u_uid","!=",`${charName}_uid`]}
    }
    dm.addCharEvent(charName,"Update",0,charRemoveEoc);

    outData['npc'] = [charClass,charInstance,charSpawner,charSpawnerEoc,charCardEoc,charCard,autoSave,charInitEoc,charRemoveEoc];
}