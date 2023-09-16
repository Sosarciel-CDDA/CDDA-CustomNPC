




/**Flag ID格式 */
export type FlagID = `${string}_FLAG_${string}`;

/**一个自定义的Flag */
export type Flag={
    type: "json_flag";
    id: FlagID;
}