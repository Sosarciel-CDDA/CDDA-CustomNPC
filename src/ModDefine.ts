import {
    AmmunitionTypeID, BoolObj, Eoc, EocEffect, EocEffectList, SpellID,
    EffectID, TalkTopicID, EocID ,FlagID,AmmoID, ArmorID, GenericID, GunID,
    ItemGroupID,MonsterID,MutationID,NpcClassID,NpcInstanceID, EnchantmentID
} from "cdda-schema";


/**mod物品前缀 */
export const MOD_PREFIX = "CNPC";

/**生成适用于此mod的ARMOR ID */
export function genArmorID(id:string):ArmorID{
    return `${MOD_PREFIX}_ARMOR_${id}`;
}
/**生成适用于此mod的附魔 ID */
export function genEnchantmentID(id:string):EnchantmentID{
    return `${MOD_PREFIX}_ENCH_${id}`;
}
/**生成适用于此mod的 通用物品 ID */
export function genGenericID(id:string):GenericID{
    return `${MOD_PREFIX}_GENERIC_${id}`;
}
/**生成适用于此mod的 枪械 ID */
export function genGunID(id:string):GunID{
    return `${MOD_PREFIX}_GUN_${id}`;
}
/**生成适用于此mod的 子弹 ID */
export function genAmmoID(id:string):AmmoID{
    return `${MOD_PREFIX}_AMMO_${id}`;
}
/**生成适用于此mod的 EOC ID */
export function genEOCID(id: string):EocID{
    return `${MOD_PREFIX}_EOC_${id}`;
}
/**生成适用于此mod的 Effect ID */
export function genEffectID(id: string):EffectID{
    return `${MOD_PREFIX}_EFF_${id}`;
}
/**生成适用于此mod的 物品组ID */
export function genItemGroupID(id:string):ItemGroupID{
    return `${MOD_PREFIX}_ITEMGP_${id}`;
}
/**生成适用于此mod的 变异ID */
export function genMutationID(id: string):MutationID{
    return `${MOD_PREFIX}_MUT_${id}`;
}
/**生成适用于此mod的 NPC职业ID */
export function genNpcClassID(id:string):NpcClassID{
    return `${MOD_PREFIX}_NPCCLS_${id}`;
}
/**生成适用于此mod的 NPCID */
export function genNpcInstanceID(id:string):NpcInstanceID{
    return `${MOD_PREFIX}_NPC_${id}`;
}
/**生成适用于此mod的 法术ID */
export function genSpellID(id:string):SpellID{
    return `${MOD_PREFIX}_SPELL_${id}`;
}
/**生成适用于此mod的 怪物ID */
export function genMonsterID(id:string):MonsterID{
    return `${MOD_PREFIX}_MON_${id}`;
}
/**生成适用于此mod的 材质类型 ID */
export function genAmmuTypeID(id:string):AmmunitionTypeID{
    return `${MOD_PREFIX}_AMMUNIT_${id}`;
}
/**生成适用于此mod的 FLAG ID */
export function genFlagID(id:string):FlagID{
    return `${MOD_PREFIX}_FLAG_${id}`;
}
/**生成适用于此mod的 TalkTopic ID */
export function genTalkTopicID(id:string):TalkTopicID{
    return `${MOD_PREFIX}_TALKTC_${id}`;
}

/**生成适用此mod的触发eoc 
 * @param forceId 强制使用原id
*/
export function genActEoc(id:string,effect:EocEffect[],condition?: (BoolObj),forceId:boolean=false):Eoc{
    return {
        type:"effect_on_condition",
        id: forceId? id as any:genEOCID(id),
        eoc_type:"ACTIVATION",
        effect,condition
    }
}