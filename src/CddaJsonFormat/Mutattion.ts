import { BodyPartID, CddaID } from "./GenericDefine";
import { ArmorID } from "./Item";


/**Mutation ID格式
 * @TJS-type string
 */
export type MutationID = CddaID<"MUT">;

/**变异 */
export type Mutation = {
	type: "mutation";
	id: MutationID;
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
	prereqs?: MutationID[];
    /**同时需要前置变异 */
	prereqs2?: MutationID[];
    /**产生此变异时会取消的变异 */
    cancels?: MutationID[];
	/**附带的变异 */
	leads_to?: MutationID[];
    /**可进阶为什么变异 */
    changes_to?: MutationID[];
    /**是一个开始可选的变异 */
    starting_trait?: boolean,
	/**内置护甲 */
	integrated_armor?: ArmorID[];
	/**可否净化 */
	purifiable?: boolean;
    /**是否有效 */
    valid?:boolean;
    /**可否被玩家看到 */
    player_display?: boolean;
    /**同时有正面与负面的混合效果 */
    mixed_effect?: boolean;
	/**潮湿保护 */
	wet_protection?: BPWetProte[];
    /**受此突变限制的身体部位列表 */
	restricts_gear?: BodyPartID[];
    /**突变时将删除任何刚性装甲的身体部位列表 任何综合装甲物品都直接考虑 */
	remove_rigid?: BodyPartID[];
    /**如果有“restricts_gear”列表，则设置该位置是否仍然允许由软材料制成的物品
     * 只有其中一种类型需要是软的才能被视为软 默认值:false
     */
	allow_soft_gear?: boolean;
    /**如果为 true，则在突变时会销毁“restricts_gear”位置中的齿轮（默认值：false） */
	destroys_gear?: boolean;
};

/**肢体的潮湿保护 */
export type BPWetProte = {
	/**肢体 */
	part: BodyPartID;
	/**忽略潮湿点数 */
	ignored: number;
};
