import { Color, DefineMonFaction, Volume, Weight } from "./GenericDefine";
/**Monster ID格式 */
export type MonsterID = `${string}_MON_${string}`;
export type Monster = {
    id: MonsterID;
    type: "MONSTER";
    name: string;
    description: string;
    /**看上去像哪个id的物品 */
    looks_like?: string;
    /**默认阵营 */
    default_faction: DefineMonFaction;
    /**体积 影响不同大小目标的近战命中率 */
    volume: Volume;
    /**重量 */
    weight: Weight;
    /**生命值 */
    hp: number;
    /**行动速度 */
    speed: number;
    /**ASCII模式的显示 */
    symbol: string;
    /**颜色 */
    color?: Color;
    /**攻击性 到达10会开始主动攻击 取值范围为 大于0*/
    aggression?: number;
    /**初始士气 小于 0 时会逃跑 */
    morale?: number;
    /**被动产生的光照 */
    luminance?: number;
    /**白天视野 */
    vision_day?: number;
    /**夜晚视野 */
    vision_night?: number;
    /**材质 */
    material?: string[];
    /**战利品 "exempt" 为无收获*/
    harvest?: string;
    /**死亡效果 */
    death_function?: {
        corpse_type: "NO_CORPSE";
        message?: string;
    };
    flags?: MonsterFlag[];
    /**攻击的行动点 */
    attack_cost?: number;
};
/**怪物可用的Flag 列表 */
export declare const MonsterFlagList: readonly ["SEES", "HEARS", "NOHEAD", "HARDTOSHOOT", "FLIES", "PRIORITIZE_TARGETS", "NO_BREATHE", "NOGIB"];
/**怪物可用的Flag */
export type MonsterFlag = (typeof MonsterFlagList)[number];