import { MOD_PREFIX } from "@src/DataManager";

/**生成适用于此mod的 法术ID */
export function genSpellID(id:string){
    return `${MOD_PREFIX}_SPELL_${id}`;
}