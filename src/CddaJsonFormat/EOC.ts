import { MOD_PREFIX } from "@src/Data";


/**生成适用于此mod的 EOC ID */
export function genEOCID(id:string){
    return `${MOD_PREFIX}_NPC_${id}`;
}