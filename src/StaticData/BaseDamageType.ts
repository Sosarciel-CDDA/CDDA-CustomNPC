import { saveStaticData } from "./StaticData";
import { DamageInfoOrder, DamageType, DamageTypeID, Eoc } from "cdda-schema";





/**近战检测 */
const MeleeCheck:DamageType={
    type:"damage_type",
    id:"MeleeCheck" as DamageTypeID,
    name:"近战检测事件辅助伤害",
    no_resist:true,
    ondamage_eocs:["CNPC_EOC_CheckSucessMeleeAttackEvent"]
}
const MeleeCheckIO:DamageInfoOrder={
    type:"damage_info_order",
    id:MeleeCheck.id
}

/**远程检测 */
const RangeCheck:DamageType={
    type:"damage_type",
    id:"RangeCheck" as DamageTypeID,
    name:"远程检测事件辅助伤害",
    no_resist:true,
    ondamage_eocs:["CNPC_EOC_CheckCauseRangeHitEvent"]
}
const RangeCheckIO:DamageInfoOrder={
    type:"damage_info_order",
    id:RangeCheck.id
}

export const BaseDamageType = [];

saveStaticData(BaseDamageType,'static_resource',"base_damage_type");