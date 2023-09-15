/**重量 */
export type Weight = number | `${number} ${"kg" | "g"}`;
/**体积 */
export type Volume = number | `${number} ${"L" | "ml"}`;
/**长度 */
export type Length = number | `${number} ${"mm" | "cm" | "m" | "km"}`;
/**可用的颜色列表 */
export declare const ColorList: readonly ["blue", "white", "brown", "dark_gray"];
/**可用的颜色 */
export type Color = typeof ColorList[number];
/**必要的肢体组 */
declare const VitalBPList: readonly ["torso", "head"];
/**必要的肢体 */
type VitalBP = typeof VitalBPList[number];
/**四肢组 */
declare const LimbBPList: readonly ["leg_l", "leg_r", "arm_l", "arm_r"];
/**四肢 */
type LimbBP = typeof LimbBPList[number];
/**子肢体组 */
declare const SubBPList: readonly ["foot_l", "foot_r", "hand_l", "hand_r"];
/**子肢体 */
type SubBP = typeof SubBPList[number];
/**组肢体 */
export declare const BodyPartList: readonly ["torso", "head", "leg_l", "leg_r", "arm_l", "arm_r", "foot_l", "foot_r", "hand_l", "hand_r"];
/**肢体 */
export type BodyPart = VitalBP | LimbBP | SubBP;
/**npc阵营 列表 */
export declare const DefineNpcFactionList: readonly ["your_followers", "no_faction"];
/**npc阵营 */
export type DefineNpcFaction = typeof DefineNpcFactionList[number];
/**怪物阵营 列表 */
export declare const DefineMonFactionList: readonly ["player", "human", "zombie", "passive_machine"];
/**怪物阵营 */
export type DefineMonFaction = typeof DefineMonFactionList[number];
/**容器 */
export type PocketData = {
    /**容器或弹夹 */
    pocket_type: "CONTAINER" | "MAGAZINE";
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
        [key: string]: number;
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
export {};
