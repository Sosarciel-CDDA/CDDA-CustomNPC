import { AmmunitionTypeID } from "../AmmiunitionType";
import { AmmoEffectID } from "../AmmoEffect";
import { RangeDamage, Energy, Volume, CddaID, CopyfromVar, Length } from "../GenericDefine";
import { SkillID } from "../Skill";
import { GenericBase, GenericFlag } from "./Generic";
/**GUN ID格式 */
export type GunID = CddaID<"GUN">;
/**枪械 */
export type Gun = CopyfromVar<{
    id: GunID;
    type: "GUN";
    /**用于射击的技能 */
    skill: SkillID;
    /**接受重新加载的弹药类型 */
    ammo: AmmunitionTypeID[];
    /**发射时的远程伤害 */
    ranged_damage?: RangeDamage | RangeDamage[];
    /**发射时的范围 */
    range?: number;
    /**枪的不准确度, 以角度分钟 (MOA) 的百分之一为单位测量
     * 当枪械模组中存在 sight_dispersion 和 aim_speed 时, 瞄准系统会选择“最佳”
     * 用于每个目标操作的瞄准器, 这是在当前目标阈值下具有分散性的最快瞄准器
     */
    dispersion?: number;
    /**瞄准机构产生的枪支不准确度, 以角度分之一 (MOA) 为单位测量 */
    sight_dispersion?: number;
    /**射击时产生的后坐力, 以角度分钟 (MOA) 的百分之一为单位测量 */
    recoil?: number;
    /**抵抗损坏/生锈, 也决定了失火几率 */
    durability?: number;
    /**发射黑火药弹药时, 有 N 分之一的几率 (每次射击）被堵塞（越高越好)。 可选, 默认为 8 */
    blackpowder_tolerance?: number;
    /**枪发射多颗子弹连射时的最小弹药后坐力。 */
    min_cycle_recoil?: number;
    /**可以装载的最大弹药量 */
    clip_size?: number;
    /**除了普通弹药 (如果有)之外, 枪还需要一些电能。
     * 枪内电池电量耗尽。
     * 使用标志“USE_UPS”和“USES_BIONIC_POWER”来耗尽其他资源。
     * 这也适用于模组。 附加带有 energy_drain 的模组将增加/增加武器的消耗。
     */
    energy_drain?: Energy;
    /**使用的弹药量 默认1 */
    ammo_to_fire?: number;
    /**这把枪的射击模式 DEFAULT,AUTO, MELEE
     * 后面是游戏中显示的模式名称
     * 最后是该模组的射击次数。
     */
    modes?: FireMode[];
    /**重新加载的时间量, 100 = 1 秒 = 1 "turn" */
    reload?: number;
    /**将使用不可拆卸标签集成到武器中的模组数组 */
    built_in_mods?: string[];
    /**将在生成时添加到武器的 mod 数组 */
    default_mods?: string[];
    /**锯开桶时损失的体积量 每英寸大约 250 毫升是一个不错的近似值 */
    barrel_volume?: Volume;
    /**枪管长度 */
    barrel_length?: Length;
    /**枪械的有效位置以及该位置的插槽安装量 */
    valid_mod_locations?: VaildMod[];
    /**这把枪射击时产生的噪音量。
     * 如果未定义值, 则根据加载弹药的响度值进行计算。
     * 最终响度计算为枪支响度+枪械响度+弹药响度。
     * 如果最终响度为 0, 则枪声完全静音。
     **/
    loudness?: number;
    /**枪械的flag */
    flags?: GunFlag[];
    /**子弹附加效果 */
    ammo_effects?: AmmoEffectID[];
    /**重装时发出的声音 */
    reload_noise?: string;
    /**重装时发出的声音大小 */
    reload_noise_volume?: number;
    /**可能适用于该枪的故障类型； 通常继承自单个抽象, 例如rifle_base, 但也存在例外 */
    faults?: string[];
    /**武器的处理； 更好的操控性意味着更少的后坐力 */
    handling?: number;
    heat_per_shot?: undefined;
    cooling_value?: undefined;
    overheat_threshold?: undefined;
    hurt_part_when_fired?: undefined;
} & GenericBase>;
/**开火模式 */
export type FireMode = [
    /**基础模式 */
    FireModeName,
    /**模式名称 semi-auto auto */
    FireModeDisplayName,
    /**射击次数 */
    number,
    /**额外flag */
    (FireModeFlag | FireModeFlag[])?
];
/**开火模式名 */
export type FireModeName = [
    "DEFAULT",
    "AUTO",
    "MELEE",
    "BURST",
    "MULTI"
][number];
/** 开火模式显示名 */
export type FireModeDisplayName = [
    "semi-auto",
    "revolver",
    "single",
    "auto",
    "double",
    "multi",
    "high auto",
    `${number} rd.`,
    `${number}s sequence`,
    `pulse`
][number];
export type FireModeFlag = [
    "NPC_AVOID",
    "MELEE",
    "SIMULTANEOUS"
][number];
/**有效枪械组件 */
export type VaildMod = [
    /**组件类型/位置 "brass catcher" "grip" */
    string,
    /**可安装数 */
    number
];
/**枪械可用的flag 列表 */
export declare const GunFlagList: readonly ["NO_UNLOAD", "NEEDS_NO_LUBE", "NEVER_JAMS", "NON_FOULING"];
/**枪械可用的flag */
export type GunFlag = typeof GunFlagList[number] | GenericFlag;
/**
BACKBLAST                   在开枪者身后引起小爆炸。目前没有实施？
BIPOD                       处理奖励仅适用于MOUNTABLE地图/车辆图块。不包括使用时间惩罚 (请参阅SLOW_WIELD)。
BRASS_CATCHER               这个枪械是黄铜捕手, 可以储存你射击的所有外壳
CHARGE                      必须充能才能开火。更高的电荷会造成更大的伤害。
CHOKE                       这个枪械是一个扼流圈, 它会阻止你射击蛞蝓
COLLAPSED_STOCK             枪的长度减少20厘米；与 相同FOLDED_STOCK; 由于某种原因现在不起作用
COLLAPSIBLE_STOCK           减少与枪的基本尺寸成比例的武器体积 (不包括任何模组）。不包括使用时间惩罚（请参阅NEEDS_UNFOLD)。
CONSUMABLE                  使枪部件有机会根据发射的弹药以及可定义字段“consume_chance”和“consume_divisor”而受到损坏。
DISABLE_SIGHTS              防止使用基础武器瞄准具。
EASY_CLEAN这                把武器比较简单, 清洁和润滑只需一半的时间
FIRE_TWOHAND                只有当玩家有两只空闲的手时才能开枪。
FOLDED_STOCK                枪的长度减少20厘米；与...一样COLLAPSED_STOCK
INSTALL_DIFFICULT           这个枪械很难安装, 如果安装失败, 你可能会损坏你的枪
IRREMOVABLE                 使得枪械无法被移除。
IS_ARMOR                    该枪械可以使用装甲语法并且可以佩戴 (与您安装此模组的武器相同)
LASER_SIGHT                 该枪械是激光瞄准器, 如果满足特定条件 (目标很近, 而且不太亮？), 则会提供瞄准加成。
MECH_BAT                    这是一种奇特的电池, 旨在为军用机械提供动力。
MOUNTED_GUN                 枪只能在有旗帜的地形/家具上使用MOUNTABLE。
NEEDS_NO_LUBE               该武器不需要润滑油即可正常工作
NEVER_JAMS                  永远不会出现故障。
NON_FOULING                 枪不会变脏或被黑火药污染。
NO_TURRET                   防止生成该枪的车辆炮塔原型。
NO_UNLOAD                   无法卸载。
PRIMITIVE_RANGED_WEAPON     允许使用非枪械工具来修复 (但不能加固)它。
PUMP_ACTION                 枪的泵动装置上有导轨, 仅允许安装带下PUMP_RAIL_COMPATIBLE flag枪管插槽的模组。
PUMP_RAIL_COMPATIBLEMod     可以安装在枪管下的插槽上, 并在其泵动作上带有导轨。
RELOAD_AND_SHOOT            射击会自动重新装弹, 然后射击。
RELOAD_EJECT                重新装弹时而不是发射时从枪中弹出炮弹。
RELOAD_ONE                  一次只能重新加载一轮。
REMOVED_STOCK               将枪的长度减少 26 厘米, 在锯断枪托时应用
STR_DRAW                    除非角色的力量至少是所需最小力量的两倍, 否则该武器的射程会减小。
STR_RELOAD                  装弹速度受力量影响。
UNDERWATER_GUN              该枪针对水下使用进行了优化, 但在水外的表现确实很差。
WATERPROOF_GUN              枪不会生锈, 可以在水下使用。
WONT_TRAIN_MARKSMANSHIP     射击这把枪不会训练你的枪法
 */ 
