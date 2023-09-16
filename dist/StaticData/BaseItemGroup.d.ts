import { ItemGroup } from "../CddaJsonFormat";
/**空物品组 */
export declare const EmptyGroup: ItemGroup;
export declare const BaseItemGroup: ({
    type: "item_group";
    id: `${string}_ITEMGROUP_${string}`;
    subtype?: "collection" | "distribution" | undefined;
} & {
    items?: (string | [string, number])[] | undefined;
})[];
