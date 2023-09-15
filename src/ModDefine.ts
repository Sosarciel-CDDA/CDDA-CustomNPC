/**mod物品前缀 */
export const MOD_PREFIX = "CNPC";

/**生成适用于此mod的ARMOR ID */
export function genArmorID(id:string){
    return `${MOD_PREFIX}_ARMOR_${id}`;
}
/**生成适用于此mod的 通用物品 ID */
export function genGenericID(id:string){
    return `${MOD_PREFIX}_GENERIC_${id}`;
}
/**生成适用于此mod的 子弹 ID */
export function genAmmoID(id:string){
    return `${MOD_PREFIX}_AMMO_${id}`;
}
/**生成适用于此mod的 EOC ID */
export function genEOCID(id: string) {
	return `${MOD_PREFIX}_NPC_${id}`;
}
/**生成适用于此mod的 物品组ID */
export function genItemGroupID(id:string){
    return `${MOD_PREFIX}_ITEMGROUP_${id}`;
}
/**生成适用于此mod的 变异ID */
export function genMutationID(id: string) {
	return `${MOD_PREFIX}_MUT_${id}`;
}
/**生成适用于此mod的 NPC职业ID */
export function genNpcClassID(id:string){
    return `${MOD_PREFIX}_NPCLASS_${id}`;
}
/**生成适用于此mod的 NPCID */
export function genNpcInstanceID(id:string){
    return `${MOD_PREFIX}_NPC_${id}`;
}
/**生成适用于此mod的 法术ID */
export function genSpellID(id:string){
    return `${MOD_PREFIX}_SPELL_${id}`;
}
/**生成适用于此mod的 怪物ID */
export function genMonsterID(id:string){
    return `${MOD_PREFIX}_MON_${id}`;
}
/**生成适用于此mod的 材质类型 ID */
export function genAmmiTypeID(id:string){
    return `${MOD_PREFIX}_AMMITYPE_${id}`;
}
