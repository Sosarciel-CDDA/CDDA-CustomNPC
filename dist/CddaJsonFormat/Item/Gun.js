"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GunFlagList = void 0;
/**枪械可用的flag 列表 */
exports.GunFlagList = [
    "NO_UNLOAD",
    "NEEDS_NO_LUBE",
    "NEVER_JAMS",
    "NON_FOULING", //枪不会变脏或被黑火药污染。
];
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
