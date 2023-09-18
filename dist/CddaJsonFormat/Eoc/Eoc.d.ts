import { CddaID, Time } from "../GenericDefine";
import { BoolObj } from "./VariableObject";
import { EocEffect } from "./EocEffect";
/**EOC ID格式 */
export type EocID = CddaID<"EOC">;
/**EOC */
export type Eoc = {
    type: "effect_on_condition";
    /**唯一ID */
    id: EocID;
    /**eoc类型 */
    eoc_type: EocType;
    /**效果 */
    effect?: EocEffect[];
    /**启用条件 */
    condition?: BoolObj;
    /**循环间隔 */
    recurrence?: Time;
    /**是否可在NPC上运行 */
    global?: boolean;
    /**是否可在NPC上运行 global生效时才可用 */
    run_for_npcs?: boolean;
};
/**EOC类型 列表 */
export declare const EocTypeList: readonly ["EVENT", "ACTIVATION", "RECURRING", "OM_MOVE"];
/**EOC类型 */
export type EocType = typeof EocTypeList[number];
