import { FakeSpell } from "./Enchantment";
import { NumObj } from "./Eoc";
import { FieldID } from "./Field";
import { BodyPartID, CddaID } from "./GenericDefine";
import { AnyItemID } from "./Item";




/**法术ID
 */
export type SpellID = CddaID<"SPELL">;


/**法术 */
export type Spell = {
	id: SpellID;
	type: "SPELL";
	name: string;
	description: string;
	valid_targets: SpellTarget[];
    /**法术效果类型 */
	effect: SpellEffect;
    /**法术效果子类型 取决于主类型 */
	effect_str?: string;
    /**法术范围形状 */
	shape: SpellShape;
    /**法术子效果 */
	extra_effects?: FakeSpell[];
    /**受影响的身体部位 */
	affected_body_parts?: BodyPartID[];
    /**法术flag */
	flags: SpellFlag[];
    /**属于哪个职业的法术 */
	spell_class?: string;
    /**初始施法时间 */
	base_casting_time?: NumObj;
    /**极限的施法时间 */
	final_casting_time?: NumObj;
    /**每级的施法时间调整 */
	casting_time_increment?: NumObj;
    /**初始能量消耗 */
	base_energy_cost?: NumObj;
    /**极限的能量消耗 */
	final_energy_cost?: NumObj;
    /**每级的能量消耗调整 */
	energy_increment?: NumObj;
    /**法术使用的能量池 默认魔力 */
	energy_source?: SpellEnergySource;
    /**施法材料ID */
	components: AnyItemID[];
    /**法术难度 */
	difficulty?: NumObj;
    /**法术最大等级 */
	max_level?: NumObj;
    /**初始法术准确度 -15 左右时总是能被格挡 */
	min_accuracy?: NumObj;
    /**极限法术准确度 20 左右时几乎无法格挡 */
	max_accuracy?: NumObj;
    /**每级的法术准确度调整 */
	accuracy_increment?: NumObj;
    /**初始法术伤害 */
	min_damage?: NumObj;
    /**极限法术伤害 */
	max_damage?: NumObj;
    /**每级的法术伤害调整 */
	damage_increment?: NumObj;
    /**初始法术aoe范围 */
	min_aoe?: NumObj;
    /**极限法术aoe范围 */
	max_aoe?: NumObj;
    /**每级的法术aoe范围调整 */
	aoe_increment?: NumObj;
    /**初始法术施法范围 */
	min_range?: NumObj;
    /**极限法术施法范围 */
	max_range?: NumObj;
    /**每级的法术施法范围调整 */
	range_increment?: NumObj;
    /**初始法术持续伤害 */
	min_dot?: NumObj;
    /**极限法术持续伤害 */
	max_dot?: NumObj;
    /**每级的法术持续伤害调整 */
	dot_increment?: NumObj;
    /**初始法术持续时间 */
	min_duration?: NumObj;
	/**极限法术持续时间 */
    max_duration?: NumObj;
    /**每级的法术持续时间调整 */
	duration_increment?: NumObj;
    /**初始法术穿甲 */
	min_pierce?: NumObj;
    /**极限法术穿甲 */
	max_pierce?: NumObj;
    /**每级的法术穿甲调整 */
	pierce_increment?: NumObj;
    /**法术在目标处创建的Field */
	field_id?: FieldID;
    /**每个被法术影响到的地块有 1/n 的概率产生Field */
	field_chance?: NumObj;
    /**初始法术地块效果强度 */
	min_field_intensity?: NumObj;
    /**极限法术地块效果强度 */
	max_field_intensity?: NumObj;
    /**每级的法术地块效果强度调整 */
	field_intensity_increment?: NumObj;
    /**法术地块效果强度的浮动值 0.1时为 +-10% */
	field_intensity_variance?: NumObj;
    /**法术产生的声音类型 */
	sound_type?: SpellSoundType;
    /**发书产生的声音描述 起效于"You hear %s" 默认为 "an explosion" */
	sound_description?: string;
    /**视为环境声音 */
	sound_ambient?: boolean;
    /**声音ID */
	sound_id?: string;
    /**声音变体ID */
	sound_variant?: string;
    /**当列表内所有法术到达指定等级时学会此法术
     * 法术ID : 需求等级
     */
	learn_spells?: Record<SpellID,NumObj>;
};

/**法术有效目标 列表 */
export const SpellTargetList = [
    "hostile",//敌人
    "ground" ,//地面
    "self"   ,//自己
    "ally"   ,//任何
    "none"   ,//无
] as const;
/**法术有效目标 */
export type SpellTarget = typeof SpellTargetList[number];


/**法术效果 列表 */
export const SpellEffectList = [
    "area_pull"             , //将其 AOE拉valid_targets向目标位置。目前，拉动距离设置为 1（请参阅directed_push）。
    "area_push"             , //将valid_targets其 AOE 推离目标位置。目前，推送距离设置为 1（请参阅directed_push）。
    "attack"                , //valid_targets对其范围造成伤害，并对effect_str目标施加指定效果。破坏地形使用bash。
    "banishment"            , //杀死MONSTER范围内的任何人以伤害生命值。任何溢出的生命值均取自施法者；如果它超过施法者的生命值，法术就会失败。
    "bash"                  , //猛击目标地形。使用 Damage() 作为 bash 的强度。
    "charm_monster"         , //魅惑生命值低于伤害（）的怪物，持续时间大约为（）。
    "dash"                  , //向前冲至射程内并击中目标的圆锥形目标。
    "directed_push"         , //将valid_targetsaoe 推离目标位置，距离为 Damage()。相反，负值会拉动。
    "effect_on_condition"   , //在所有有效目标上运行effect_on_conditionfrom 。effect_strEOC将以玩家为中心，NPC作为施法者。
    "emit"                  , //emit在目标处造成。
    "explosion"             , //引起以目标为中心的爆炸。使用 Damage() 计算功率和因子 aoe()/10。
    "flashbang"             , //导致闪光弹效果以目标为中心。使用 Damage() 计算功率和因子 aoe()/10。
    "fungalize"             , //使目标真菌化。
    "guilt"                 , //目标会产生负罪感，就好像它杀死了施法者一样。
    "map"                   , //绘制以玩家为中心、以 aoe() 为半径的覆盖图。
    "mod_moves"             , //向目标添加 Damage() 移动。负值会“冻结”一段时间。
    "morale"                , //为范围内的 NPC 或化身提供士气效果。使用 Damage() 作为值。 decay_start是持续时间（）/ 10。
    "mutate"                , //改变目标。如果effect_str已定义，则向该类别变异，而不是随机选择。如果MUTATE_TRAIT使用该标志，则允许effect_str成为特定特征。Damage() / 100 是突变成功的百分比（10000 代表 100.00%）。
    "noise"                 , //对目标造成伤害（）噪音量。注：噪声可以用sound_type、sound_description、sound_ambient、sound_id和进一步描述sound_variant。
    "pain_split"            , //平衡你所有四肢的伤害。
    "pull_target"           , //尝试将目标沿直线拉向施法者。如果路径被无法通行的家具或地形阻挡，则效果失败。
    "recover_energy"        , //恢复相当于法术伤害的能量源。能量源在、、或中定义，effect_str并且可以是其中之一。BIONICFATIGUEPAINMANASTAMINA
    "remove_effect"         , //移除effect_str范围内所有生物的效果。
    "remove_field"          , //移除effect_straoe 中的一个字段。如果移除的场为 ，则根据场密度导致不同强度的远程辉光和潜在的隐形传态fd_fatigue。
    "revive"                , //像僵尸死灵法师一样复活怪物。怪物必须有REVIVES旗帜。
    "short_range_telepor"   , //将玩家传送到具有 AOE 变化的随机范围空间。另请参见TARGET_TELEPORT和UNSAFE_TELEPORT标志。
    "slime_split"           , //粘液根据质量分裂成两个大的或普通的粘液。注意：针对mon_blob-类型敌人进行硬编码，检查怪物death_function+法术summon组合。
    "spawn_item"            , //生成一个物品，该物品将在其持续时间结束时消失。默认持续时间为 0。
    "summon"                , //召唤 aMONSTER或monstergroup来自effect_str该召唤物的召唤将在其持续时间结束时消失。默认持续时间为 0。另请参见SPAWN_WITH_DEATH_DROPS标志。
    "summon_vehicle"        , //vehicle召唤出的aeffect_str将在其持续时间结束时消失。默认持续时间为 0。
    "targeted_polymorph"    , //如果目标怪物的生命值低于该法术的伤害，则该怪物将永久转变为MONSTER指定的怪物。effect_str如果effect_str留空，目标将随机转变为具有相似难度等级的怪物。或者，该POLYMORPH_GROUP标志可用于从 中选取加权 ID monstergroup。玩家和 NPC 免疫该法术效果。
    "ter_transform"         , //改变范围内的地形和家具。aoe 中任意一点发生变化的几率是 1/（伤害）。是effect_str的 ID ter_furn_transform。
    "timed_event"           , //仅向玩家添加定时事件。有效的定时事件有：amigara, artifact_light, dim, help, robot_attack, roots_die, spawn_wyrms, temple_flood, temple_open, temple_spawn, wanted。 注意：这只是为工件主动效果添加的。支持有限，使用风险自负。
    "translocate"           , //打开一个窗口，允许施法者选择要传送到的易位门。
    "upgrade"               , //立即升级一个目标MONSTER。
    "vomit"                 , //任何处于其范围内的生物都会立即呕吐，如果它能够这样做的话。
] as const;
/**法术效果 */
export type SpellEffect = typeof SpellEffectList[number];

/**法术范围形状 列表*/
export const SpellShapeList = [
    "blast"	,//以撞击位置为中心的圆形爆炸。Aoe值是半径。
    "cone"	,//发射一个圆锥体，其弧度等于 aoe（以度为单位）。
    "line"	,//发射一条宽度等于 aoe 的线。
]
/**法术范围形状 */
export type SpellShape = typeof SpellShapeList[number];

/**法术Flag 列表*/
export const SpellFlagList = [
    "CONCENTRATE"	                ,//焦点影响法术失败百分比。
    "EXTRA_EFFECTS_FIRST"	        ,//该法术extra_effects将在主要法术效果之前发生。
    "FRIENDLY_POLY"	                ,//如果法术成功结算，法术的目标targeted_polymorph将会对施法者变得友好。
    "HOSTILE_SUMMON"	            ,//召唤法术总是会产生敌对的怪物。
    "HOSTILE_50"	                ,//召唤的怪物在 50% 的情况下会友好地生成。
    "IGNITE_FLAMMABLE"	            ,//如果法术区域有任何易燃物品，就会产生火灾
    "IGNORE_WALLS"	                ,//法术的 AOE 可以穿过墙壁。
    "LOUD"	                        ,//法术会对目标产生额外的噪音。
    "MUST_HAVE_CLASS_TO_LEARN"	    ,//当你拥有 时，该法术会自动学习spell_class；当你失去它时，该法术会被移除。
    "MUTATE_TRAIT"	                ,//覆盖mutate法术效果以使用特定的 Trait_id 而不是类别。
    "NO_EXPLOSION_SFX"	            ,//该法术不会产生视觉爆炸效果。
    "NO_FAIL"	                    ,//该法术在施展时不会失败。
    "NO_HANDS"	                    ,//手不影响法术能量消耗。
    "NO_LEGS"	                    ,//腿不影响施法时间。
    "NO_PROJECTILE"	                ,//法术的“射弹”部分会穿过墙壁，法术效果的中心正是你瞄准的地方，不考虑障碍物。
    "NON_MAGICAL"	                ,//计算伤害减轻时忽略法术抗力。
    "PAIN_NORESIST"	                ,//改变疼痛的法术无法被抵抗（就像死亡特性一样）。
    "PERCENTAGE_DAMAGE"	            ,//该法术根据目标当前的生命值造成伤害。这意味着该法术无法直接杀死目标。
    "PERMANENT"	                    ,//用此法术生成的物品或生物不会像平常一样消失和死亡。物品只有在最高法术等级时才能永久存在；任何法术等级的生物都可以是永久的。
    "PERMANENT_ALL_LEVELS"	        ,//即使该法术不是最高等级，用该法术生成的物品也不会消失。
    "POLYMORPH_GROUP"	            ,//咒语targeted_polymorph会将目标变成随机的monstergroup怪物effect_str。
    "RANDOM_AOE"	                ,//在（最小值+增量）*级别和最大值之间选择随机数，而不是正常行为。
    "RANDOM_CRITTER"	            ,//与地面相同，RANDOM_TARGET但忽略地面。
    "RANDOM_DAMAGE"	                ,//在（最小值+增量）*级别和最大值之间选择随机数，而不是正常行为。
    "RANDOM_DURATION"	            ,//在（最小值+增量）*级别和最大值之间选择随机数，而不是正常行为。
    "RANDOM_TARGET"	                ,//强制法术在范围内随机选择一个有效目标，而不是由施法者选择目标。这也影响到extra_effects。
    "SILENT"	                    ,//法术不会对目标发出任何噪音。
    "SOMATIC"	                    ,//手臂负担会影响失败率和施法时间（轻微）。
    "SPAWN_GROUP"	                ,//item_group      从或生成或召唤monstergroup，而不是特定 ID。
    "SPAWN_WITH_DEATH_DROPS"	    ,//允许召唤的怪物保留其通常的死亡掉落物，否则它们不会掉落任何东西。
    "SWAP_POS"	                    ,//投射法术会交换施法者和目标的位置。
    "TARGET_TELEPORT"	            ,//传送法术更改为最大范围目标，并以范围作为目标周围的变化。
    "UNSAFE_TELEPORT"	            ,//传送法术有杀死施法者或其他人的风险。
    "VERBAL"	                    ,//法术会在施法者所在位置发出噪音，嘴部阻碍会影响失败百分比。
    "WONDER"	                    ,//这极大地改变了父法术的行为：法术本身不施放，但伤害和范围信息用于施放extra_effects。extra_effects将随机选择n个施放，其中n是法术当前的伤害（与RANDOM_DAMAGE旗帜叠加），施放法术的消息也会显示。如果不需要这个咒语的消息，请确保message它是一个空字符串。
] as const;
/**法术Flag */
export type SpellFlag = typeof SpellFlagList[number];

/**法术能量池 列表 */
export const SpellEnergySourceList = [
    "MANA", "BIONIC", "HP", "STAMINA", "NONE"
]
/**法术能量池 */
export type SpellEnergySource = typeof SpellEnergySourceList[number];

/**法术声音类型 列表 */
export const SpellSoundTypeList = [
    "background", "weather", "music", "movement", "speech", "activity",
    "destructive_activity", "alarm", "combat", "alert", "order",
] as const;
/**法术声音类型 */
export type SpellSoundType = typeof SpellSoundTypeList[number];
