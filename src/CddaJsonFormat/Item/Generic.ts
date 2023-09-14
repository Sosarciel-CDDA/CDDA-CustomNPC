import { MOD_PREFIX } from "@src/DataManager";
import { Color, Volume, Weight } from "../GenericDefine";





/**生成适用于此mod的 通用物品 ID */
export function genGenericID(id:string){
    return `${MOD_PREFIX}_GENERIC_${id}`;
}
/**通用物品 */
export type Generic = {
	type: "GENERIC";
	flags?: GenericFlag[];
}&GenericBase;

/**通用物品基础 */
export type GenericBase={
	/**物品唯一ID */
	id: string;
	/**物品显示名 */
	name: string;
    /**描述 */
	description: string;
	/**重量 0重量物品需要添加 ZERO_WEIGHT标签 */
    weight: Weight;
    /**体积 0体积物品需要添加 ZERO_WEIGHT标签*/
	volume: Volume;
    /**物品价格 */
	price?: number|`${number} usd`;
    /**大灾变后的物品价格 */
	price_postapoc?: number|`${number} usd`;
	/**ascii显示符号 */
	symbol: string;
    /**颜色 */
	color?: Color;
	/**材质 */
	material?: string[];
	/**使用效果 */
	use_action?:UseAction,
}



export type UseAction = {
	type: "place_npc"; // place npc of specific class on the map
	npc_class_id: string; // npc id, see npcs/npc.json
	summon_msg?: string; // (optional) message when summoning the npc.
	place_randomly?: true; // if true: places npc randomly around the player, if false: let the player decide where to put it (default: false)
	moves: number; // how many move points the action takes.
	radius: number; // maximum radius for random npc placement.
} | {
	type: "effect_on_conditions"; 		// activate effect_on_conditions
	description: string; 				// usage description
	effect_on_conditions?: string[]; 	// ids of the effect_on_conditions to activate
};

/**通用物品的flag列表 */
export const GenericFlagList = ["ZERO_WEIGHT"] as const;
/**通用物品的flag */
export type GenericFlag = typeof GenericFlagList[number];




/**
ACT_IN_FIRE							如果掉落在带有火的瓷砖上，该物品将被激活
ALLERGEN_MILK						该产品含有牛奶，乳糖不耐症人士不可食用
ANIMAL_PRODUCT						该物品不能被素食主义者佩戴或食用，尽管它的材料没有被列入黑名单，或者它没有其他标志来限制它
BAD_TASTE这							种食物的味道为-5，无法通过烹饪来覆盖
BANK_NOTE_SHAPED					该物品可像钞票一样放入钱包的折叠套中。
BANK_NOTE_STRAP_SHAPED				该物品可放入用于放钱带的口袋中（如收银机）。
BATTERY_HEAVY						该商品为重型电池，可放入有重型电池限制的口袋中
BATTERY_LIGHT						该商品为轻型电池，可放入有轻型电池限制的口袋中
BATTERY_MEDIUM						该商品为中型电池，可放入有中型电池限制的口袋中
BATTERY_ULTRA_LIGHT					该产品为超轻电池，可放入有超轻电池限制的口袋中
BIONIC_ARMOR_INTERFACE				这种仿生学可以为动力装甲提供动力。
BIONIC_FUEL_SOURCE					该物品的内容用于为仿生学提供燃料
BIONIC_NPC_USABLENPC				可以使用安全的 CBM，无需大量 NPC 重写即可利用切换 CBM。
BIONIC_POWER_SOURCE					这种仿生是仿生力量的来源。
BIONIC_SLEEP_FRIENDLY				如果玩家在其活动时尝试睡觉，该仿生不会发出警告。
BIONIC_TOGGLED						该仿生设备仅在激活时才具有功能，而不是每回合都会产生效果。
BIONIC_WEAPON_MELEE					该武器是仿生近战武器，用于 EoC 中的不同检查
BIRD								食物，只有BIRD阈值突变的玩家才能吃；看INEDIBLE
BURNOUT								您可以目视检查烧毁的程度（蜡烛、火炬）
CALORIES_INTAKE						此项目可让您在消耗菜单中查看有关今天和明天的卡路里摄入量的详细信息。CALORIES_INTAKE_TRACKER可以与显示相同信息的 use 操作一起使用
CAMERA_PRO							此产品是专业相机，可提高所拍照片的质量
CAN_HAVE_CHARGES					该标志不再有用，应该被废弃
CAN_HAVE_CHARGES					该标志不再有用，应该被废弃
CATTLE								食物，只有CATTLE阈值突变的玩家才能吃；看INEDIBLE
CBM									该项目为CBM，分别工作
COIN_SHAPED							该商品形状像硬币，适合放入钱包的零钱包中。
COLLAPSE_CONTENTS					该项目的内容默认隐藏，您需要使用> show/hide content按钮手动显示它
CONDUCTIVE							即使其制成的材料不导电，该物品也被视为导电。对面NONCONDUCTIVE。
COOP_CARD							让您可以进入工匠作坊
CORPSE								用于在地图生成期间生成各种人类尸体的旗帜。
CREDIT_CARD_SHAPED					该物品的形状像信用卡，可放入钱包和类似口袋的卡槽中。
CRUTCHES							带有此标志的物品可以帮助角色在腿折断时不至于跌倒。
CUSTOM_EXPLOSION					标记，自动应用于explosion在定义中已定义数据的项目。看JSON_INFO.md
CUT_HARVEST							你需要像镰刀这样的割草工具来收割这种植物
DANGEROUSNPC						不会接受该物品。爆炸 iuse actor 暗示了这个标志。意味着NPC_THROW_NOW。
DETERGENT							该产品可用作洗衣机中的清洁剂。
DISCOUNT_VALUE_1					该商品为在自动燃气控制台购买的燃料提供小额折扣
DISCOUNT_VALUE_2					该商品提供在自动燃气控制台购买的燃料的平均折扣
DISCOUNT_VALUE_3					该商品为在自动燃气控制台购买的燃料提供了很大的折扣
DROP_ACTION_ONLY_IF_LIQUID			drop_action仅当物品处于液相时才会引起
DURABLE_MELEE						该物品是为了击中物体而设计的，而且效果很好，因此它被认为比由相同材料制成的其他武器坚韧得多。
ELECTRONIC							该物品包含敏感电子设备，可以被附近的电磁脉冲爆炸炸毁。
FAKE_MILLItem						是一个假物品，表示 @ref Item::process_fake_mill 的部分研磨产品，其中设置了移除条件。
FAKE_SMOKEItem						是一个产生烟雾的假物品，可通过 @ref item::process_fake_smoke 识别，其中设置了其移除条件。
FELINE								食物，只有FELINE阈值突变的玩家才能吃；看INEDIBLE
FIREWOOD							该物品可以用作柴火。带有此标志的物品会被分类到“战利品：木材”区域
FLAMING								该物品着火了，你使用它会造成额外的火焰伤害
FRAGILE_MELEE						由于结构质量差，用作武器时容易散架的易碎物品，破损后会碎成部件。
FRESH_GRAIN							该产品是鲜切谷物，可以在炉子上干燥
GASFILTER_MED						这是一个中型气体过滤筒，用作各种防毒面具的弹匣
GASFILTER_SM						这是一个小尺寸的气体过滤筒，用作各种防毒面具的弹匣
GAS_DISCOUNT						自动加油站的折扣卡。
GAS_TANK							该物品可以储存气体
GEMSTONE							这是宝石，你可以把它放在一些首饰里
HARD								在没有填充的情况下覆盖项目检查，使之变得坚硬、僵硬且不舒服；SOFT与旗帜相反
HELMET_HEAD_ATTACHMENT				该产品可以固定在安全帽上；目前仅用于手电筒
HURT_WHEN_WIELDED					武器对你的右臂造成伤害（如果武器是双手，则对双臂造成伤害），等于其伤害
INDUSTRIAL_CARD						用于工业ID卡，开启工业读卡器t_card_industrial
IRREPLACEABLE_CONSUMABLE			灾难持续的时间越长，该物品的价格就会上涨。目前未使用
IS_PET_ARMOR						是宠物怪的铠甲，不是人的铠甲。
ITEM_BROKEN							物品已损坏，无法再激活。
JAVELIN								该物品为标枪，可放入标枪袋中
LEAK_ALWAYS							泄漏（可与 结合使用RADIOACTIVE）。
LEAK_DAM							损坏时泄漏（可与 结合使用RADIOACTIVE）。
LUPINE								食物，只有LUPINE阈值突变的玩家才能吃（比如狗粮）；看INEDIBLE
MC_MOBILE,MC_HAS_DATA				存储卡相关标志，参见einktabletpc和相机相关函数
METHANOL_TANK						该物品为甲醇罐，用作各种甲醇动力工具的弹匣
MILITARY_CARD						用于军人身份证，打开军卡读卡器t_card_military
MISSION_ITEM						该物品的生成几率不受世界物品生成比例因子的影响。
MOP									该物品可用于清除溢出的液体，例如血液或水。
MOUSE								食物，只有MOUSE阈值突变的玩家才能吃；看INEDIBLE
MUNDANE								该物品使用与魔法相关的功能，但本身不是魔法 - 对于结界来说，这意味着该物品的颜色不会更改为粉红色，而对于法术来说，物品描述将从“该物品在咒语级别施放咒语名称”更改为“该项目激活后：spell_name “。of可以单独使用这个功能，使用 booleanuse_action"type": "cast_spell""mundane": true
MUTAGEN_SAMPLE						该物品为诱变剂样品，并Used in the creation of mutagenic drugs在物品描述中显示消息
NANOFAB_REPAIR						该物品可以使用 nanofabricator 修复
NANOFAB_TEMPLATE					本项为nanofabricator模板，可以使用相关语法
NEEDS_UNFOLD						挥舞时会受到额外的时间惩罚。对于近战武器和枪支，这会被相关技能所抵消。与 堆叠SLOW_WIELD。
NO_CLEAN							该物品无法清洁
NO_PACKED							该物品无法防止污染，也无法保持无菌状态。仅适用于 CBM。
NO_REPAIR							即使存在其他合适的工具，也会阻止修复该物品。
NO_SALVAGE							物品不能通过抢救过程被分解。最好在某些东西不能被分解时使用（即基本组件，如皮革补丁）。
NO_STERILE							该物品不是无菌的。仅适用于 CBM。
NPC_ACTIVATENPC 					可以激活该物品作为替代攻击。目前是在激活后立即扔掉它来完成的。由 暗示BOMB。
NPC_ALT_ATTACK						不应该直接设置。NPC_ACTIVATE由和隐含NPC_THROWN。
NPC_SAFE							如果你给NPC，无论对你的信任程度如何，他们都会消耗掉这个物品
NPC_THROWNNPC 						将抛出此物品（无需先激活它）作为替代攻击。
NPC_THROW_NOWNPC 					会尝试扔掉该物品，最好是扔给敌人。意味着TRADER_AVOID和NPC_THROWN。
OLD_CURRENCY						在大灾变之前，纸币和硬币曾经是法定货币，但仍然可以被一些自动化系统接受。
PALS_LARGE							该物品可以连接到 MOLLE 肩带上，并且会消耗 3 个插槽
PALS_MEDIUM							该物品可以连接到 MOLLE 肩带上，并且会消耗 2 个插槽
PALS_SMALL							该物品可以连接到 MOLLE 肩带上，并且会消耗 1 个插槽
PAPER_SHAPED				该产品呈薄纸状，可存放在皮革日记本中
PERFECT_LOCKPICK			该物品是一个完美的开锁器。只需 5 秒就可以开锁，而且永远不会失败，但使用它只能获得少量的开锁经验值。该物品的LOCKPICK品质至少为 1。
PLANTABLE_SEED				该物品是种子，您可以种植它
PRESERVE_SPAWN_OMT			该项目将在项目 var 中存储它生成的 OMT spawn_location_omt。
PSEUDO						在内部用于标记工艺库存中提到的但实际上不是物品的物品。它们可以用作工具，但不能用作组件。意味着TRADER_AVOID。
RABBIT						食物，只有RABBIT阈值突变的玩家才能吃；看INEDIBLE
RADIOACTIVE					具有放射性（可与 一起使用LEAK_*）。
RADIO_INVOKE_PROC			该物品可以接收信号，使其引爆
RAD_DETECT					该物品是辐射徽章，可以根据玩家周围的辐射水平打印其颜色变化。硬编码
RAIN_PROTECT				使用时可防晒、防雨。
RAT							食物，只有RAT阈值突变的玩家才能吃；看INEDIBLE
REBREATHER_CART				这是一个循环呼吸器盒，用作各种循环呼吸器面罩的弹匣
REBREATHER					如果您佩戴此物品，您的氧气含量不会低于 12（默认值约为 50）
REDUCED_BASHING				Gunmod 旗帜；使物品的猛击伤害降低 50%。
REDUCED_WEIGHT				Gunmod 旗帜；使物品的基本重量减少 25%。
REQUIRES_TINDER				要求该物品试图在其上起火的瓷砖上存在火种。
ROBOFAC_ROBOT_MEDIUM		该物品是中型 Hub 01 无人机，您可以将其存放在无人机技术线束的特定插槽中
ROBOFAC_ROBOT_SMALL			该物品是小型 Hub 01 无人机，您可以将其存放在无人机技术线束的特定插槽中
SCIENCE_CARD_MAINTENANCE_BLUE
SCIENCE_CARD_MAINTENANCE_BLUE
SCIENCE_CARD_MAINTENANCE_GREEN
SCIENCE_CARD_MAINTENANCE_YELLOW
SCIENCE_CARD_MEDICAL_RED
SCIENCE_CARD_MUTAGEN_CYAN
SCIENCE_CARD_MUTAGEN_GREEN
SCIENCE_CARD_MUTAGEN_PINK
SCIENCE_CARD_MU_UNIVERSAL
SCIENCE_CARD_SECURITY_BLACK
SCIENCE_CARD_SECURITY_MAGENTA
SCIENCE_CARD_SECURITY_YELLOW
SCIENCE_CARD_TRANSPORT_1
SCIENCE_CARD_VISITOR		这个和上面都是用来打开TCL的相关门的
SHEATH_BOW					该产品可装入弓形吊带中
SHEATH_SPEAR				该物品可以连接到矛带上
SINGLE_USE					该项目在使用后将被删除。按费用计数的项目不需要此操作，因为它们会在费用用完时被删除。
SLEEP_AID_CONTAINER			该产品内部装有助眠剂，有助于睡眠。（例如，这是一个枕套）。
SLEEP_AID					该项目有助于睡眠。
SLEEP_IGNORE				该项目不显示为睡前警告。
SLOW_WIELD					挥舞时会受到额外的时间惩罚。对于近战武器和枪支，这会被相关技能所抵消。与 堆叠NEEDS_UNFOLD。
SOFT						覆盖项目检查以柔软、不僵硬且舒适；HARD与旗帜相反
SOLARPACK_ON				该产品开启太阳能背包，在阳光下可以为不同的东西充电
SPAWN_ACTIVE				该项目始终处于活动状态，无需手动激活
SPLINT						此物品是夹板，戴在身体破损部位时，会慢慢修复
STRICT_HUMANITARIANISM		标记，如果食物是用亚人肉烹制的，则自动应用于食物，并允许在名称中进行不同的食物相互作用
TACK						物品可以用作安装座的大头钉。
TANGLE						当该物品被投掷并击中目标时，有机会将其缠住并使其无法动弹。
TARDIS						带有此标志的容器项目会绕过对口袋数据的内部检查，因此内部可能比外部更大，并且可以容纳不适合其尺寸的项目。
TIE_UP						物品可以用来束缚生物。
TINDER						该物品可用作火种，用带有REQUIRES_TINDER标记的引火物来点燃火。
TOBACCO						该物品是点燃的雪茄或香烟，佩戴时会产生吸烟效果
TOURNIQUET					该物品是止血带，它可以暂时降低出血强度并增加您的有效压缩极限
TOW_CABLE					该产品是牵引电缆，可以牵引车辆
TRADER_AVOIDNPC				不会从该物品开始。将此用于活动物品（例如手电筒（打开））、危险物品（例如活动炸弹）、假物品或不寻常物品（例如独特的任务物品）。
TRADER_KEEP_EQUIPPED		NPC 仅在当前未佩戴或挥舞该物品时才会交易该物品。
TRADER_KEEP					NPC	在任何情况下都不会交易该物品。
TWO_WAY_RADIO				该项目是双向无线电，并相应地工作
UNBREAKABLE_MELEE			用作近战武器时永远不会受到损坏。
UNBREAKABLE					该物品无论是作为盔甲穿着还是用作近战武器时都不会被直接损坏。
UNRECOVERABLE				无法从拆卸中恢复。
USE_POWER_WHEN_HIT			当你被击中时，该护甲会消耗能量，等于所造成的伤害（能量消耗发生在护甲缓解之前）
WATER_BREAK_ACTIVE			如果处于活动状态，物品可能会被弄湿并在水中破裂。
WATER_BREAK					物品在水中破损。
WATER_DISSOLVE				物品溶解在水中。
ZERO_WEIGHT					通常重量为零的物品会产生错误。使用此标志来指示零权重是故意的并抑制该错误。
 */