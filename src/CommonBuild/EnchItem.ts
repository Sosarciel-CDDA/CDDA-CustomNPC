import { DataManager } from "@src/DataManager";
import { JObject } from "@zwa73/utils";
import { Eoc, Tool, ToolID } from "CddaJsonFormat";
import { genEOCID } from "ModDefine";




export function createEnchItem(dm:DataManager){
    const out:JObject[] = [];
    const ActiveEnchEocID = genEOCID("ActiveEnch");
    const testItem:Tool = {
        id:"mc_longsword" as ToolID,
        type:"TOOL",
        "copy-from":"mc_longsword" as ToolID,
        extend:{
            flags:["ACTIVATE_ON_PLACE"]
        },
        use_action:{
            type:"effect_on_conditions",
            description:"激活附魔",
            effect_on_conditions:[ActiveEnchEocID]
        }
    }
    out.push(testItem);

    const ActiveEnchEoc:Eoc = {
        id:ActiveEnchEocID,
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        effect:[
            {math:["n_isActiveEnch","=","1"]}
        ],
        condition:{math:["n_isActiveEnch","!=","1"]}
    }
    out.push(ActiveEnchEoc);

    dm.addStaticData(out,"common_resource","DetonateTearSpell");
}