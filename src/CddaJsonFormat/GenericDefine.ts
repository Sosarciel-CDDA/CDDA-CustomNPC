/**重量 */
export type Weight = number|`${number} ${"kg"|"g"}`;
/**体积 */
export type Volume = number|`${number} ${"L"|"ml"}`;
/**长度 */
export type Length = number|`${number} ${"mm"|"cm"|"m"|"km"}`;
/**能量 */
export type Energy = number|`${number} ${"mJ"|"kJ"}`;
/**价格 */
export type Price = number|`${number} ${"USD"|"cent"|"kUSD"}`;
/**可用的颜色列表 */
export const ColorList = ["blue","white","brown","dark_gray"] as const;
/**可用的颜色 */
export type Color = typeof ColorList[number];


/**必要的肢体组 */
const VitalBPList = [
    "torso" ,
    "head"  ,
] as const;
/**必要的肢体 */
type VitalBP = typeof VitalBPList[number];

/**四肢组 */
const LimbBPList = [
    "leg_l" , "leg_r" ,
    "arm_l" , "arm_r" ,
] as const;
/**四肢 */
type LimbBP = typeof LimbBPList[number];

/**子肢体组 */
const SubBPList = [
    "foot_l", "foot_r",
    "hand_l", "hand_r",
] as const;
/**子肢体 */
type SubBP = typeof SubBPList[number];

/**组肢体 */
export const BodyPartList = [...VitalBPList,...LimbBPList,...SubBPList] as const;
/**肢体 */
export type BodyPart = VitalBP|LimbBP|SubBP;


/**npc阵营 列表 */
export const DefineNpcFactionList = [
    "your_followers",
    "no_faction",
] as const;
/**npc阵营 */
export type DefineNpcFaction = typeof DefineNpcFactionList[number];

/**怪物阵营 列表 */
export const DefineMonFactionList = [
    "player",
    "human",
    "zombie",
    "passive_machine",
] as const;
/**怪物阵营 */
export type DefineMonFaction = typeof DefineMonFactionList[number];

/**容器 */
export type PocketData = {
    /**容器或弹夹 */
	pocket_type: "CONTAINER"|"MAGAZINE";
    /**此口袋可以容纳的最大体积，所有包含的物品的总和 */
	max_contains_volume: Volume;
    /**此口袋可以容纳的最大重量，所有容器物品的总重量 */
	max_contains_weight: Weight;
    /**可放入此口袋的物品的最小体积。 小于此尺寸的物品不能放入口袋中 */
	min_item_volume?: Volume;
	/**可通过开口放入此口袋的物品的最大体积 */
    max_item_volume?: Volume;
    /**可放入此口袋的物品的最大长度（按其最长边）。 默认值为假设体积为立方体的对角线开口长度 (cube_root(vol)*square_root(2)) */
	max_item_length?: Length;
    /**腐坏速度乘数 将物品放入此口袋中如何影响损坏。 小于1.0，物品保存时间更长； 0.0 将无限期保留 */
	spoil_multiplier?: number;
    /**重量乘数 个口袋里的物品神奇地内部重量比外部重量轻 原版中的任何东西都不应该有一个weight_multiplier */
	weight_multiplier?: number;
    /**体积乘数 该口袋中的物品内部体积小于外部体积。 可用于有助于组织特定内容的容器，例如用于管道胶带的纸板卷 */
	volume_multiplier?: number;
    /**表示在最佳条件下从口袋中取出物品所需的移动次数。 */
	moves?: number;
    /**默认 false。 如果为 true，则该口袋的大小是固定的，并且在填充时不会扩展。 玻璃罐是刚性的，而塑料袋则不是。 */
	rigid?: boolean;
    /**默认 false。 如果属实，则玩家无法使用该口袋 */
	forbidden?: boolean;
    /**在口袋开始膨胀之前可以放置物品的空间量。 仅当rigid = false 时才有效。 */
	magazine_well?: Volume;
    /**默认 false。 如果属实，可能含有液体。 */
	watertight?: boolean;
    /**默认 false。 如果属实，可能含有气体。 */
	airtight?: boolean;
    /**默认 false。 如果属实，该物品包含一个烧蚀板。 确保在可以添加的车牌类型上包含 flag_restriction。 */
	ablative?: boolean;
    /**默认 false。 如果为 true，则只能将一堆物品放入此口袋内，如果该物品不是 count_by_charges，则只能放置一件物品。 */
	holster?: boolean;
    /**默认 false。 如果为 true，则如果将此物品放入另一个物品中，该口袋中的物品将会溢出 */
	open_container?: boolean;
    /**默认 false。 如果属实，口袋可以保护里面的物品在扔进火里时不会爆炸。 */
	fire_protection?: boolean;
    /**将口袋限制为给定的弹药类型和数量。 这会覆盖强制性的体积、重量、水密和气密，以使用给定的弹药类型。 一个口袋可以容纳任意数量的独特弹药类型，每种弹药类型的数量不同，并且容器只能容纳一种类型（截至目前）。 如果省略它，它将是空的。 */
	ammo_restriction?: {
        /**子弹类型 : 容纳数量 */
        [key:string]: number
    };
    /**只有当物品具有与这些标志之一匹配的标志时，才能将其放入此口袋中。 */
	flag_restriction?: string[];
    /**只有这些物品 ID 才能放入此口袋中。 超越弹药和旗帜限制。 */
	item_restriction?: string[];
    /**有主要由该材料制成的物品才能进入。 */
	material_restriction?: string[];
	/**如果口袋有 sealed_data，则在物品生成时它将被密封。 口袋的密封版本将覆盖相同数据类型的未密封版本  */
	sealed_data?: Partial<PocketData>;
    /**如果口袋继承了标志，则意味着里面的物品对拥有口袋本身的物品有贡献的任何标志。 */
	inherits_flags?: true;
};


/**远程武器伤害 */
export type RangeDamage = {
    /**伤害类型 */
    damage_type: DamageType;
    /**伤害值 */
    amount: number;
    /**穿甲值 */
    armor_penetration: number;
}
/**近战武器伤害 */
export type MeleeDamage = {
    /**伤害类型 : 伤害值 不能为负数*/
    DamageType?:number
}
/**伤害类型 */
export type DamageType = "stab"|"bash"|"cut";


/**爆炸 */
export type Explosion = {
    /**TNT 当量炸药的克数为单位测量爆炸威力，影响伤害和射程 */
    power: number;
    /**每个爆炸方块保留了多少能量。 必须小于 1 且大于 0。 */
    distance_factor: number;
    /**爆炸可能产生的最大（听觉）噪音。 */
    max_noise: number;
    /**爆炸是否会留下火 */
    fire?: boolean;
    /**破片数据 */
    shrapnel: ShrapnelData;
}
/**破片数据
 * 为数字时 套管总质量，其余碎片变量设置为合理的默认值。
 */
export type ShrapnelData = {
    /**套管总质量、套管/功率比决定破片速度。 */
    casing_mass: number;
    /**每个碎片的质量（以克为单位）。 大碎片击中更重，小碎片击中更频繁。 */
    fragment_mass: number;
    /**在着陆点掉落物品的几率百分比。 */
    recovery?: number;
    /**在着陆点掉落哪个物品。 */
    drop?: string;
}|number

/**物理状态 */
export type Phase = "solid";


