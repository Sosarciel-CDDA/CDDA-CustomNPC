import { DataManager } from "@src/DataManager";
import { JObject } from "@zwa73/utils";
import { genAddEffEoc, genTriggerEffect } from "./UtilGener";
import { genEffectID, genSpellID } from "ModDefine";
import { Effect, Spell } from "cdda-schema";


export async function createTest(dm:DataManager){
    let outData:JObject[] = [];

    const effid = genEffectID("TestEff");
    const eff:Effect = {
        id:effid,
        type:"effect_type",
        name:["测试触发效果"],
        max_intensity:1000,
    }
    outData.push(genTriggerEffect(dm,eff,"TakeDamage","-1",[],120));
    outData.push(eff);

    const eoc = genAddEffEoc(effid,120);

    const spell:Spell = {
        id:genSpellID("effecTest"),
        type:"SPELL",
        valid_targets:["self"],
        shape:"blast",
        name:"测试效果法术",
        description:"测试效果法术",
        effect:"effect_on_condition",
        effect_str:eoc.id
    }

    outData.push(eoc,spell);

    dm.addStaticData(outData,"test");
}