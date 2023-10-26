import { CddaID } from "./GenericDefine";
/**伤害信息顺序ID */
export type DamageInfoOrderID = CddaID<"DIO">;
/**伤害信息顺序 */
export type DamageInfoOrder = {
    /** 唯一标识符，必须对应一个已存在的 damage_type */
    id: DamageInfoOrderID;
    /**(可选) 确定在保护值中显示此伤害类型的详细程度。有效值为 "detailed"，"basic" 和 "none" (默认为 "none")
     */
    info_display?: "detailed" | "basic" | "none";
    /**(可选) 描述如何应用此伤害类型的动词（例如："bashing"）。在物品信息的近战部分使用
     */
    verb?: string;
    /**(可选) 确定在物品信息的指定部分中此伤害类型的顺序和可见性  */
    bionic_info?: DmgInfo;
    /**(可选) 确定在物品信息的指定部分中此伤害类型的顺序和可见性  */
    protection_info?: DmgInfo;
    /**(可选) 确定在物品信息的指定部分中此伤害类型的顺序和可见性  */
    pet_prot_info?: DmgInfo;
    /**(可选) 确定在物品信息的指定部分中此伤害类型的顺序和可见性  */
    melee_combat_info?: DmgInfo;
    /**(可选) 确定在物品信息的指定部分中此伤害类型的顺序和可见性  */
    ablative_info?: DmgInfo;
};
/** 确定在物品信息的指定部分中此伤害类型的顺序和可见性  */
export type DmgInfo = {
    /** 确定在此部分中将其显示在伤害类型列表的何处 */
    order?: number;
    /** 确定是否在此部分显示此伤害类型 */
    show_type?: boolean;
};
