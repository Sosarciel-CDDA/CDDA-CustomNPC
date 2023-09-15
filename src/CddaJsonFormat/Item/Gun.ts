import { RangeDamage, Energy, Volume } from "../GenericDefine";
import { GenericBase } from "./Generic";

export type Gun = {
	type: "GUN";
    /**用于射击的技能 */
	skill: string;
    /**接受重新加载的弹药类型 */
	ammo: string[];
    /**发射时的远程伤害 */
	ranged_damage: RangeDamage;
    /**发射时的范围 */
	range: number;
    /**枪的不准确度，以角度分钟 (MOA) 的百分之一为单位测量
     * 当枪械模组中存在 sight_dispersion 和 aim_speed 时，瞄准系统会选择“最佳”
     * 用于每个目标操作的瞄准器，这是在当前目标阈值下具有分散性的最快瞄准器
     */
	dispersion: number;
    /**瞄准机构产生的枪支不准确度，以角度分之一 (MOA) 为单位测量 */
	sight_dispersion: number;
    /**射击时产生的后坐力，以角度分钟 (MOA) 的百分之一为单位测量 */
	recoil: number;
    /**抵抗损坏/生锈，也决定了失火几率 */
	durability: number;
    /**发射黑火药弹药时，有 N 分之一的几率（每次射击）被堵塞（越高越好）。 可选，默认为 8 */
	blackpowder_tolerance?: number;
    /**枪每次攻击能够发射多次的最小弹药后坐力。 */
	min_cycle_recoil: number;
    /**可以装载的最大弹药量 */
	clip_size: number;
    /**除了普通弹药（如果有）之外，枪还需要一些电能。
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
    /**重新加载的时间量，100 = 1 秒 = 1 "turn" */
	reload: number;
    /**将使用不可拆卸标签集成到武器中的模组数组 */
	built_in_mods?: string[];
    /**将在生成时添加到武器的 mod 数组 */
	default_mods?: string[];
    /**锯开桶时损失的体积量 每英寸大约 250 毫升是一个不错的近似值 */
	barrel_volume?: Volume;
    /**枪械的有效位置以及该位置的插槽安装量 */
	valid_mod_locations?: VaildMod[];
    /**这把枪射击时产生的噪音量。
     * 如果未定义值，则根据加载弹药的响度值进行计算。
     * 最终响度计算为枪支响度+枪械响度+弹药响度。
     * 如果最终响度为 0，则枪声完全静音。
     **/
	loudness: number;
} & GenericBase;

/**开火模式 */
export type FireMode = [
    /**基础模式 */
    "DEFAULT"|"AUTO"|"MELEE",
    /**模式名称 semi-auto auto */
    string,
    /**射击次数 */
    number
]
/**有效枪械组件 */
export type VaildMod = [
    /**组件类型/位置 "brass catcher" "grip" */
    string,
    /**可安装数 */
    number
];