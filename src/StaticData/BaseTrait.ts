import { Mutation, OverlayOrdering } from "cdda-schema";
import { saveStaticData } from "./StaticData";
import { genMutationID } from "@src/ModDefine";
import { STAT_MOD_ENCHID } from "./BaseEnch";

/**标记此npc是cnpc的npc */
export const CNPC_FLAG = genMutationID("CnpcFlag");

export const CnpcFlagMut:Mutation={
    type:"mutation",
    id:CNPC_FLAG,
    name:"自定义NPC标识符",
    description:"表示此角色是自定义NPC的NPC,会启用EOC",
    purifiable:false,
    valid:false,
    player_display:false,
    points:0,
}
export const CnpcBaseBody:Mutation={
    type:"mutation",
    id:genMutationID("BaseBody"),
    name:"自定义NPC替代素体",
    description:"代替原素体的贴图变异",
    purifiable:false,
    valid:false,
    player_display:false,
    points:0,
}
//调整素体变异层级到最低
export const BaseBodyOrdering:OverlayOrdering={
    type:"overlay_order",
    overlay_ordering:[
        {id:[genMutationID("BaseBody")],order:0}
    ]
}

/**无动画变异ID */
export const NO_ANIM = genMutationID("NoAnim");
const NoAnim:Mutation={
    type:"mutation",
    id:NO_ANIM,
    name:"无动画标识符",
    description:"表示此角色没有动画",
    purifiable:false,
    valid:false,
    player_display:false,
    points:0,
}

/**属性增强变异 */
export const STAT_MOD_MUTID = genMutationID("StatMod");
const StatMod:Mutation={
    type:"mutation",
    id:STAT_MOD_MUTID,
    name:"属性强化",
    description:"使力量提供额外的近战伤害倍率, 感知提供远程伤害加值与倍率, 敏捷提供速度倍率。",
    purifiable:false,
    valid:false,
    player_display:false,
    points:0,
    enchantments:[STAT_MOD_ENCHID],
}

export const BaseTrait=[CnpcFlagMut,CnpcBaseBody,BaseBodyOrdering,NoAnim,StatMod];
saveStaticData(BaseTrait,'static_resource','base_trait');