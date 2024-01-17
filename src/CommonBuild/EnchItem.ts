import { ToolQuality, ToolQualityID } from "cdda-schema";
import { DataManager } from "@src/DataManager";
import { JObject } from "@zwa73/utils";
import { Eoc, Tool, ToolID, ItemToolQuality, EocID, Generic, FlagID, Flag, EocEffect, CondObj, BoolObj, Spell, DamageTypeID } from "cdda-schema";
import { CCharHook } from "CnpcEvent";
import { genActEoc, genEOCID, genGenericID, genSpellID } from "ModDefine";
import { CON_SPELL_FLAG } from "StaticData";


/**手持触发 */
function genWieldTrigger(dm:DataManager,flagId:FlagID,hook:CCharHook,effects:EocEffect[],condition?:BoolObj){
    const eoc = genActEoc(`${flagId}_WieldTigger`,effects,{and:[
        {u_has_wielded_with_flag:flagId},
        ...(condition ? [condition] : [])
    ]});
    dm.addEvent(hook,0,eoc);
    return eoc;
}

function numToRoman(num:number) {
    const romanNumerals = {
        M : 1000,
        CM: 900 ,
        D : 500 ,
        CD: 400 ,
        C : 100 ,
        XC: 90  ,
        L : 50  ,
        XL: 40  ,
        X : 10  ,
        IX: 9   ,
        V : 5   ,
        IV: 4   ,
        I : 1   ,
    } as const;
    let roman = '';
    for (let key in romanNumerals) {
        const fixk = key as (keyof typeof romanNumerals)
        while (num >= romanNumerals[fixk]) {
            roman += key;
            num -= romanNumerals[fixk];
        }
    }
    return roman;
}

/**子eoc */
function enchEID(flag:Flag,t:"add"|"remove"){
    return `${flag.id}_${t}` as EocID;
}

/**附魔集 */
type EnchSet = {
    /**主要标志 */
    main:Flag;
    /**强度变体数据集 */
    lvl:{
        /**附魔标志 */
        ench:Flag;
        /**随机权重 */
        weight:number;
    }[];
}


export async function createEnchItem(dm:DataManager){
    const EnchList:EnchSet[] = [
        await knockback(dm),
    ];
    await enchTest(dm,EnchList);
}

export async function knockback(dm:DataManager) {
    const enchName = "击退";
    const enchId = "Knockback";
    const maxLvl = 5;
    const out:JObject[]=[];

    //构造附魔集
    const mainench:Flag = {
        type:"json_flag",
        id:enchId as FlagID,
        name:enchName,
    };
    out.push(mainench);
    const enchSet:EnchSet={
        main:mainench,
        lvl:[]
    };
    for(let i=1;i<=maxLvl;i++){
        const subid = `${enchId}_${i}`;
        const subName = `${enchName} ${numToRoman(i)}`;
        const ench:Flag = {
            type:"json_flag",
            id:subid as FlagID,
            name:subName,
            info:`<color_white>[${subName}]</color> 这件物品可以造成 ${i} 点击退伤害`,
        };
        const tspell:Spell = {
            id:genSpellID(subid),
            type:"SPELL",
            flags:[...CON_SPELL_FLAG],
            min_damage:i,
            max_damage:i,
            damage_type:"Knockback" as DamageTypeID,
            effect:"attack",
            shape:"blast",
            valid_targets:["ally","hostile","self"],
            name:`${subName} 附魔触发法术`,
            description: `${subName} 附魔触发法术`
        }
        const teoc = genWieldTrigger(dm,ench.id,"TryMeleeAttack",[
            {npc_location_variable:{global_val:`_${enchId}_loc`}},
            {u_cast_spell:{id:tspell.id},loc:{global_val:`_${enchId}_loc`}}
        ])
        out.push(ench,tspell,teoc);
        enchSet.lvl.push({ench,weight:maxLvl+1-i});
    }
    //互斥
    enchSet.lvl.forEach((lvlobj)=>{
        const ench = lvlobj.ench;
        ench.conflicts = ench.conflicts??[];
        ench.conflicts.push(...enchSet.lvl
            .filter((sublvlobj)=>sublvlobj.ench.id!=ench.id)
            .map((subelvlobj)=>subelvlobj.ench.id))
    })
    dm.addStaticData(out,"common_resource","ench",enchId);
    return enchSet;
}


export async function enchTest(dm:DataManager,enchSets:EnchSet[]){
    const out:JObject[] = [];

    //展开附魔集等级标志
    const flatEnchSet:Flag[] = [];
    enchSets.forEach((enchset)=>
        enchset.lvl.forEach((lvlobj)=>
            flatEnchSet.push(lvlobj.ench)
        )
    )

    const NONEEocId = "EnchTestNone" as EocID;

    const enchTestList = [
        [genActEoc("EnchTestAdd",[{
            run_eoc_selector:[...flatEnchSet.map((ench)=>enchEID(ench,"add")),NONEEocId],
            names:[...flatEnchSet.map((ench)=>ench.name as string),"算了"],
            hide_failing:true
        }]),"添加附魔"],
        [genActEoc("EnchTestRemove",[{
            run_eoc_selector:[...flatEnchSet.map((ench)=>enchEID(ench,"remove")),NONEEocId],
            names:[...flatEnchSet.map((ench)=>ench.name as string),"算了"],
            hide_failing:true
        }]),"移除附魔"],
        [genActEoc(NONEEocId,[],undefined,true),"取消调试"],
    ] as const;
    out.push(...enchTestList.map((item)=>item[0]));


    //添加附魔子eoc
    enchSets.forEach((enchset)=>{
        enchset.lvl.forEach((lvlobj)=>{
            out.push(genActEoc(enchEID(lvlobj.ench,"add"),[
                {npc_set_flag:lvlobj.ench.id},
                {npc_set_flag:enchset.main.id}
            ],{not:{npc_has_flag:enchset.main.id}},true));
        });
    })
    //移除附魔子eoc
    enchSets.forEach((enchset)=>{
        enchset.lvl.forEach((lvlobj)=>{
            out.push(genActEoc(enchEID(lvlobj.ench,"remove"),[
                {npc_unset_flag:lvlobj.ench.id},
                {npc_unset_flag:enchset.main.id}
            ],{npc_has_flag:lvlobj.ench.id},true));
        });
    })

    const EnchTestTool:Generic = {
        id:genGenericID("EnchTestTool"),
        type:"GENERIC",
        name:{str_sp:"附魔调试工具"},
        description:"附魔调试工具",
        weight:0,
        volume:0,
        symbol:"o",
        flags:["ZERO_WEIGHT","UNBREAKABLE"],
        use_action:{
            type:"effect_on_conditions",
            description:"附魔调试",
            menu_text:"附魔调试",
            effect_on_conditions:[{
                eoc_type:"ACTIVATION",
                id:genEOCID("EnchTestTool"),
                effect:[{
                    u_run_inv_eocs:"manual",
                    title:"选择需要调试的物品",
                    true_eocs:{
                        id:"EnchTestTool_SelectType" as EocID,
                        eoc_type:"ACTIVATION",
                        effect:[{
                            run_eoc_selector:enchTestList.map((item)=>item[0].id),
                            names:enchTestList.map((item)=>item[1]),
                            title:"选择选择调试类型"
                        }]
                    }
                }]
            }]
        }
    }
    out.push(EnchTestTool);

    dm.addStaticData(out,"common_resource","ench","EnchTest");
}