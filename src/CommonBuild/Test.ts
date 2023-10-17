import { DataManager } from "@src/DataManager";
import { JObject } from "@zwa73/utils";
import { genEffectSpell, genTriggerEffect } from "./UtilGener";
import { genEffectID, genSpellID } from "ModDefine";


export function createTest(dm:DataManager){
    let outData:JObject[] = [];

    const effid = genEffectID("TestEff");
    outData.push(...genTriggerEffect(dm,{
        id:effid,
        type:"effect_type",
        name:["测试触发效果"],
        max_intensity:1000,
    },"TakeDamage",[],120));

    outData.push(...genEffectSpell({
        id:genSpellID("effecTest"),
        type:"SPELL",
        valid_targets:["self"],
        shape:"blast",
        name:"测试效果法术",
        description:"测试效果法术",
    },effid,10,120));

    dm.addStaticData(outData,"test");
}