import { Armor, Enchantment, Eoc, Flag, Gun, ItemGroup, BoolObj } from "@sosarciel-cdda/schema";
import { CDataManager } from "../DataManager";
import { CMDef } from "CMDefine";
import { JObject } from "@zwa73/utils";
import { getCharConfig } from "./CharData";
import { getCharBaseCarryGroup, getCharBaseItemFlagId, getTalkerFieldVarID } from "./UtilGener";





/**创建角色物品 */
export async function createCharCarry(dm:CDataManager,charName:string){
    const charConfig = await getCharConfig(charName);
    //透明物品ID
    const TransparentItem = "TransparentItem";

    //背包物品组
    const carryItemGroup:ItemGroup={
        type:"item_group",
        subtype:"collection",
        id:getCharBaseCarryGroup(charName),
        entries:[]
    }
    const carryData:JObject[] = [];
    for(const carry of charConfig.carry??[]){
        const {item,count,recharge,require_field,start_count,recharge_count} = carry;
        const itemID = typeof item=="string"?item:item.id;
        //预处理物品
        if(typeof item != "string"){
            //预处理
            item.price = 0;
            item.price_postapoc = 0;
            item.looks_like = item.looks_like??TransparentItem;
            item.flags = item.flags||[];
            item.flags?.push(
                "ACTIVATE_ON_PLACE"             ,//自动销毁
                "TRADER_KEEP"                   ,//不会出售
                "UNBREAKABLE"                   ,//不会损坏
                "NO_SALVAGE"                    ,//无法拆分
                getCharBaseItemFlagId(charName) ,//基础flag
            );
            item.countdown_interval= 1; //自动销毁
            carryData.push(item);
        }
        //加入物品组
        const fixstartcount = start_count??count??1;
        if(fixstartcount>0){
            carryItemGroup.entries?.push({
                item:itemID,
                count:fixstartcount,
            });
        }
        //自动回复Eoc
        if(recharge!=undefined && recharge>=1){
            const cond: (BoolObj)[] = [
                {not:{u_has_items:{item:itemID,count:count??1}}}
            ];
            if(require_field){
                const fixfield = typeof require_field == "string"
                    ? [require_field,1]as const
                    : require_field;
                cond.push({math:[getTalkerFieldVarID("u",fixfield[0]),">=",`${fixfield[1]}`]})
            }
            const timerVar = `u_${itemID}_timer`;
            const rechargeEoc:Eoc={
                type:"effect_on_condition",
                eoc_type:"ACTIVATION",
                id:CMDef.genEOCID(`${charName}_Recharge_${itemID}`),
                effect:[
                    {math:[timerVar,"+=","1"]},
                    {run_eocs:{
                        eoc_type:"ACTIVATION",
                        id:CMDef.genEOCID(`${charName}_Recharge_${itemID}_Sub`),
                        effect:[
                            {u_spawn_item:itemID,count:recharge_count??1},
                            {math:[timerVar,"=","0"]}
                        ],
                        condition:{math:[timerVar,">=",recharge+""]}
                    }}
                ],
                condition:{and:[...cond]}
            }
            dm.addCharInvokeEoc(charName,"SlowUpdate",0,rechargeEoc);
            carryData.push(rechargeEoc);
        }

    }
    dm.addCharData(charName,[...carryData,carryItemGroup],"carry");
}