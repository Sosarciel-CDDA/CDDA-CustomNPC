import { getCharConfig, getCharList } from "@src/CharBuild/CharData";
import { CDataManager } from "@src/DataManager";
import { JObject } from "@zwa73/utils";
import { Eoc, EocID, Explosion, ItemGroup, ItemGroupID, Monster, MonsterID, Spell, SpellID } from "cdda-schema";
import { CMDef } from "CMDefine";
import { CON_SPELL_FLAG } from "StaticData";
import { getCharCardId } from "./UtilGener";


export async function createDrawCardSpell(dm:CDataManager){
    const id = `DrawCardSpell`;
    const cdvar = `${id}_cooldown`;
    const out:JObject[]=[];
    const charDataList = await Promise.all((await getCharList()).map(charName=>{
        return getCharConfig(charName)
    }));

    const spellRange = 15;
    //卡片集
    const cardGroup:ItemGroup={
        id:CMDef.genItemGroupID(`CardDistribution`),
        type:"item_group",
        subtype:"distribution",
        entries:(await getCharList()).map(charName=>({
            item:getCharCardId(charName),
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


    dm.addData(out,"common_resource","DetonateTearSpell");
}