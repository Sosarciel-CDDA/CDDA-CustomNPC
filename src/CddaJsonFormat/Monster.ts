import { FakeSpell } from "./Enchantment";
import { CddaID, Color, DefineMonFaction, DefineNpcFaction, Volume, Weight } from "./GenericDefine";
import { InlineItemGroup, ItemGroupID } from "./ItemGroup";
import { MaterialID } from "./Material";



/**Monster ID格式  
 */
export type MonsterID = CddaID<"MON">;

/**怪物 */
export type Monster = {
	id: MonsterID;
	type: "MONSTER";
	name: string;
	description: string;
    /**看上去像哪个id的物品 */
	looks_like?: string;
	/**怪物身体类型 */
	bodytype?: string;
	/**怪物子类型 */
    species?: string[];
	/**威胁度 */
    diff?: number;
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
	material?: MaterialID[];
    /**战利品 "exempt" 为无收获*/
	harvest?: string;
    /**死亡效果 */
	death_function?: {
		corpse_type?: "NO_CORPSE";
		message?:string;
		effect?:FakeSpell;
	};
	/**死亡掉落物品组 */
	death_drops?:ItemGroupID|InlineItemGroup;
	/**flag */
	flags?: MonsterFlag[];
    /**攻击的行动点 */
	attack_cost?: number;
};




/**怪物可用的Flag 列表 */
export const MonsterFlagList = [
	"SEES"              , //拥有视觉
	"HEARS"             , //拥有听觉
	"NOHEAD"            , //没有脑袋
	"HARDTOSHOOT"       , //不易被远程攻击命中
	"FLIES"             , //这个怪物会飞
	"PRIORITIZE_TARGETS", //这个怪物会依据威胁程度处理目标
	"NO_BREATHE"        , //这个怪物不需要呼吸
	"NOGIB"             , //这个怪物被超量伤害杀死时不会爆成碎块
] as const;
/**怪物可用的Flag */
export type MonsterFlag = (typeof MonsterFlagList)[number];
