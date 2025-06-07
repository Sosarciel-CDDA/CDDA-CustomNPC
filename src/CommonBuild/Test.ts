import { CDataManager } from "@src/DataManager";
import { JObject } from "@zwa73/utils";
import { genAddEffEoc, genTriggerEffect } from "./UtilGener";
import { CMDef } from "CMDefine";
import { Effect, Spell } from "@sosarciel-cdda/schema";


export async function createTest(dm:CDataManager){
    let outData:JObject[] = [];

    const effid = CMDef.genEffectID("TestEff");
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
        id:CMDef.genSpellID("effecTest"),
        type:"SPELL",
        valid_targets:["self"],
        shape:"blast",
        name:"测试效果法术",
        description:"测试效果法术",
        effect:"effect_on_condition",
        effect_str:eoc.id
    }

    outData.push(eoc,spell);

    dm.addData(outData,"test");
}