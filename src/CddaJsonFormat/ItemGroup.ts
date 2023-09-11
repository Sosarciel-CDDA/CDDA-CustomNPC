

export type ItemGroup = {
    type: "item_group",
    id: string,
    /**是可选的。它可以是 collection 或 distribution。
     * 如果未指定，则默认为old，这表示该项目组使用旧格式（本质上是分布）。
     * collection为每个entries均独立概率
     * distribution为加权轮盘随机
     */
    subtype?: "collection"|"distribution",
}& ({entries?: ItemGroupEntrie[];}|
    {item?:ItemGroupEntrieQuick[];}|
    {group?:ItemGroupEntrieQuick[];})

type ItemGroupEntrie = (ItemGroupEntrieItem|ItemGroupEntrieGroup|ItemGroupEntrieDist|ItemGroupEntrieColl)&ItemGroupEntrieOpt;
type ItemGroupEntrieItem = {item:string};
type ItemGroupEntrieGroup = {group:string};
type ItemGroupEntrieDist = {distribution:ItemGroupEntrie[]};
type ItemGroupEntrieColl = {collection:ItemGroupEntrie[]};
type ItemGroupEntrieOpt = Partial<{
    /**概率 */
    prob:number;
    damage: number|number[];
    "damage-min": number;
    "damage-max": number;
    /**使项目重复生成，每次创建一个新项目。 */
    count: number|number[];
    "count-min": number;
    "count-max": number;
    /**仅设置最小值而不是最大值将使游戏根据容器或弹药/弹匣容量计算最大费用。
     * 将 max 设置得太高会将其减少到最大容量。当设置 max 时，不设置 min 会将其设置为 0。
     */
    charges: number|number[]
    "charges-min": number;
    "charges-max": number;
    /**添加为创建项目的内容。
     * 不检查它们是否可以放入项目中。
     * 这允许水，其中包含一本书，其中包含一个钢架，其中包含一具尸体。
     */
    "contents-item": string|string[];
    /**添加为创建项目的内容。
     * 不检查它们是否可以放入项目中。
     * 这允许水，其中包含一本书，其中包含一个钢架，其中包含一具尸体。
     */
    "contents-group": string|string[];
    "ammo-item": string,
    "ammo-group": string,
    "container-group": string,
    "entry-wrapper": string,
    /**如果为 true，则物品生成时容器将被密封。默认为true */
    sealed: boolean;
    /**该项目的有效 itype 变体 ID。 */
    variant: string;
    artifact: Object;
    event: ItemGroutEvent;
}>;

type ItemGroutEvent = "none"|"new_year"|"easter"|
"independence_day"|"halloween"|"thanksgiving"|"christmas";

/** 物品id 或者 [物品id,概率]*/
type ItemGroupEntrieQuick = string|[string,number];

