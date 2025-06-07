import { Eoc, EocEffect, Generic, NPCClassBaseSkill, NpcClass, NpcInstance } from "@sosarciel-cdda/sclema";
import { CDataManager } from "../DataManager";
import { CMDef } from "CMDefine";
import { DefineSkillList, SkillID } from "@sosarciel-cdda/sclema";
import { EMPTY_GROUP_ID } from "StaticData";
import { getCharConfig } from "./CharData";
import { getCharBaseCarryGroup, getCharCardId, getCharClassId, getCharDisplayName, getCharInstanceId, getCharMutId } from "./UtilGener";





/**创建角色职业和实例  
 * @param charName 角色名  
 */
export async function createCharClass(dm:CDataManager,charName:string){
    const charConfig = await getCharConfig(charName);
    const displayName = getCharDisplayName(charName);
    /**NPC职业 */
    const charClass:NpcClass={
        type:"npc_class",
        id:getCharClassId(charName),
        name:displayName,
        job_description:`${displayName}专用的职业`,
        common: false,
        worn_override:EMPTY_GROUP_ID,
        weapon_override:EMPTY_GROUP_ID,
        carry_override:getCharBaseCarryGroup(charName),
        skills:Object.entries(charConfig.base_skill||[]).reduce((acc,item)=>{
            if(item[1]==null) return acc;
            const skillid = item[0] as SkillID|"ALL";
            const skill:NPCClassBaseSkill={
                skill: skillid,
                level: {constant:item[1]}
            }
            return [...acc,skill];
        },[] as NPCClassBaseSkill[]),
        spells:charConfig.base_spell,
        traits:[
            { "trait": CMDef.genMutationID("CnpcFlag") },
            { "trait": getCharMutId(charName) },
            ...(charConfig.base_mutation??[])
                .map(mut=>({trait:mut})),
            ]
    }
    /**NPC实例 */
    const charInstance:NpcInstance={
        type:"npc",
        id:getCharInstanceId(charName),
        name_unique:displayName,
        class:getCharClassId(charName),
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


    /**初始化事件 */
    const charInitEoc:Eoc = {
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:CMDef.genEOCID(`${charName}_InitProcess`),
        effect:[
            {if:{math:[`${charName}_hasInstance`,"==","1"]},
            then:[{math:["u_needRemove","=","1"]}]},
            {math:[`${charName}_hasInstance`,"=","1"]}
        ]
    }
    dm.addCharInvokeEoc(charName,"Init",1000,charInitEoc);

    /**销毁事件 */
    const charRemoveEoc:Eoc = {
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:CMDef.genEOCID(`${charName}_RemoveProcess`),
        effect:[
            {run_eocs:"CNPC_EOC_CnpcDeathProcess"}
        ],
        condition:{math:["u_needRemove","==",`1`]}
    }
    dm.addCharInvokeEoc(charName,"Update",0,charRemoveEoc);
    dm.addCharData(charName,
        [charClass,charInstance,charInitEoc,charRemoveEoc],
        'npc');
}