import { Mutation, OverlayOrdering } from "cdda-schema";
/**标记此npc是cnpc的npc */
export declare const CNPC_FLAG: import("cdda-schema").MutationID;
export declare const CnpcFlagMut: Mutation;
export declare const CnpcBaseBody: Mutation;
export declare const BaseBodyOrdering: OverlayOrdering;
/**无动画变异ID */
export declare const NO_ANIM: import("cdda-schema").MutationID;
/**属性增强变异 */
export declare const STAT_MOD_MUTID: import("cdda-schema").MutationID;
export declare const BaseTrait: (Mutation | OverlayOrdering)[];
