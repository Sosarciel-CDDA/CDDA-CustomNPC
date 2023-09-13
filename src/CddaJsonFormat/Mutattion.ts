import { MOD_PREFIX } from "@src/DataManager";
import { BodyPart } from "./GenericDefine";



/**生成适用于此mod的 变异ID */
export function genMutationID(id:string){
    return `${MOD_PREFIX}_MUT_${id}`;
}

/**变异 */
export type Mutation = {
	type: "mutation";
	id: string;
    /**名称 */
	name: string;
    /**描述 */
	description: string;
    /**消耗的点数 */
	points: number;
    /**可见性 */
	visibility?: number;
    /**丑陋度 */
	ugliness?: number;
    /**位置类型 */
	types?: string[];
    /**需要前置变异 */
	prereqs?: string[];
    /**可进阶为变异 */
	leads_to?: string[];
    /**内置护甲 */
	integrated_armor?: string[];
    /**可否净化 */
	purifiable?: boolean;
    /**潮湿保护 */
	wet_protection?: BPWetProte[];
};



/**肢体的潮湿保护 */
export type BPWetProte = {
    /**肢体 */
    part:BodyPart;
    /**忽略潮湿点数 */
    ignored:number;
}
