import { DataManager } from "@src/DataManager";
import { JObject } from "@zwa73/utils";
import { Eoc, EocID, Explosion, ItemGroup, ItemGroupID, Monster, MonsterID, Spell, SpellID } from "cdda-schema";
import { genItemGroupID } from "ModDefine";
import { CON_SPELL_FLAG } from "StaticData";


export async function createDrawCardSpell(dm:DataManager){
    const id = `DrawCardSpell`;
    const cdvar = `${id}_cooldown`;
    const out:JObject[]=[];
    const charDataList = await Promise.all(dm.charList.map(charName=>{
        return dm.getCharData(charName)
    }));

    const spellRange = 15;


    //卡片集
    const cardGroup:ItemGroup={
        id:genItemGroupID(`CardDistribution`),
        type:"item_group",
        subtype:"distribution",
        entries:charDataList.map(cd=>({
            item:cd.defineData.cardID,
            prob:1
        }))
    }
    out.push(cardGroup);

    //主EOC
    const maineoc:Eoc={
        type:"effect_on_condition",
        id:`${id}_eoc` as EocID,
        eoc_type:"ACTIVATION",
        effect:[
            {u_add_var:cdvar,time:true},
            {u_spawn_item:cardGroup.id,use_item_group:true,suppress_message:true},
        ],
    }
    out.push(maineoc);

    //主法术
    const mainSpell:Spell={
        type:"SPELL",
        id:id as SpellID,
        name:"抽卡",
        description:"从牌组中抽一张卡。",
        shape:"blast",
        effect:"effect_on_condition",
        effect_str:maineoc.id,
        valid_targets:["self"]
    }
    out.push(mainSpell);


    dm.addStaticData(out,"common_resource","DetonateTearSpell");
}