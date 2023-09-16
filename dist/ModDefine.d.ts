import { AmmiunitionTypeID } from "./CddaJsonFormat/AmmiunitionType";
import { EocID } from "./CddaJsonFormat/EOC";
import { FlagID } from "./CddaJsonFormat/Flag";
import { AmmoID, ArmorID, GenericID, GunID } from "./CddaJsonFormat/Item";
import { ItemGroupID } from "./CddaJsonFormat/ItemGroup";
import { MonsterID } from "./CddaJsonFormat/Monster";
import { MutationID } from "./CddaJsonFormat/Mutattion";
import { NpcClassID } from "./CddaJsonFormat/NpcClass";
import { NpcInstanceID } from "./CddaJsonFormat/NpcInstance";
/**mod物品前缀 */
export declare const MOD_PREFIX = "CNPC";
/**生成适用于此mod的ARMOR ID */
export declare function genArmorID(id: string): ArmorID;
/**生成适用于此mod的 通用物品 ID */
export declare function genGenericID(id: string): GenericID;
/**生成适用于此mod的 枪械 ID */
export declare function genGunID(id: string): GunID;
/**生成适用于此mod的 子弹 ID */
export declare function genAmmoID(id: string): AmmoID;
/**生成适用于此mod的 EOC ID */
export declare function genEOCID(id: string): EocID;
/**生成适用于此mod的 物品组ID */
export declare function genItemGroupID(id: string): ItemGroupID;
/**生成适用于此mod的 变异ID */
export declare function genMutationID(id: string): MutationID;
/**生成适用于此mod的 NPC职业ID */
export declare function genNpcClassID(id: string): NpcClassID;
/**生成适用于此mod的 NPCID */
export declare function genNpcInstanceID(id: string): NpcInstanceID;
/**生成适用于此mod的 法术ID */
export declare function genSpellID(id: string): string;
/**生成适用于此mod的 怪物ID */
export declare function genMonsterID(id: string): MonsterID;
/**生成适用于此mod的 材质类型 ID */
export declare function genAmmiTypeID(id: string): AmmiunitionTypeID;
/**生成适用于此mod的 FLAG ID */
export declare function genFlagID(id: string): FlagID;