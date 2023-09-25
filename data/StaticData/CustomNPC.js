

function print_global_val(varName){
	eoc_type("ACTIVATION")
	eobj( { u_message: "全局变量 "+varName+" 当前的值为 : <global_val:"+varName+">" })
	//eobj( { u_message: {global_val:varName}})
}

function CNPC_EOC_UpdateStat(){
	eoc_type("ACTIVATION")
	//recurrence("1 s");
	//print_global_val(mag3);
	//print_global_val(mag1);
	//print_global_val(mag2);
	/**
	u_teStr = u_val('strength');
	u_teDex = u_val('dexterity');
	u_teCon = u_val('strength');
	u_teMag = u_val('intelligence');
	u_teWil = u_val('perception');
	u_teCun = u_val('perception');
	*/
}


//初始化现有血量
function CNPC_EOC_InitCurrHP(){
	eoc_type("ACTIVATION")
	if(u_currHp==0)
		u_currHp = u_hp();
}

//受伤事件
function CNPC_EOC_TakesDamage(){
	eoc_type("EVENT");
	required_event("character_takes_damage");

	if(eobj({ "u_has_trait": "CNPC_MUT_CnpcFlag" })){
		//关键肢体生命值不足则判断为死亡
		if(or(u_hp('head')<=0,u_hp('torso')<=0))
			CNPC_EOC_CharDeath();
	}
}
//NPC死亡事件
function CNPC_EOC_NPC_DEATH(){
	eoc_type("NPC_DEATH");
	//if(eobj({ "u_has_trait": "CNPC_MUT_CnpcFlag" })){
	//	//触发动态生成的 角色死亡 事件
	//	CNPC_EOC_CharDeath();
	//}
}

//检测现有血量并触发take_damage
function CNPC_EOC_CheckCurrHP_Melee(){
	eoc_type("ACTIVATION")
	if(and(u_currHp > u_hp(),hasTarget!=1)){
		eobj({ "u_cast_spell": { "id": "CNPC_SPELL_SummonSpellTarget" } })
		hasTarget=1;
		//运行动态生成的事件eoc
		CNPC_EOC_CharCauseDamage();
		CNPC_EOC_CharCauseMeleeDamage();
		CNPC_EOC_CharTakeDamage();
		CNPC_EOC_CharTakeMeleeDamage();
	}
	u_currHp = u_hp();
}
function CNPC_EOC_CheckCurrHP_Range(){
	eoc_type("ACTIVATION")
	if(and(u_currHp > u_hp(),hasTarget!=1)){
		eobj({ "u_cast_spell": { "id": "CNPC_SPELL_SummonSpellTarget" } })
		hasTarget=1;
		//运行动态生成的事件eoc
		CNPC_EOC_CharCauseDamage();
		CNPC_EOC_CharCauseRangeDamage();
		CNPC_EOC_CharTakeDamage();
		CNPC_EOC_CharTakeRangeDamage();
	}
	u_currHp = u_hp();
}

//尝试近战攻击触发的Eoc
function CNPC_EOC_MeleeHitEvent(){
	eoc_type("ACTIVATION")
	if(eobj({ "u_has_trait": "CNPC_MUT_CnpcFlag" })){
		//释放检测血量法术判断是否击中目标
		eobj({"u_cast_spell":{"id":"CNPC_SPELL_CheckCurrHP_Melee"}})

		//通用攻击事件
		CNPC_EOC_HitEvent()

		//运行动态生成的 造成近战攻击 事件eoc
		CNPC_EOC_CharCauseMeleeHit()

		hasTarget=0; //重置flag
		eobj({"u_cast_spell":{"id":"CNPC_SPELL_KillSpellTarget"}}) //清理标靶
	}
}
//尝试远程攻击触发的Eoc
function CNPC_EOC_RangeHitEvent(){
	eoc_type("ACTIVATION")
	if(eobj({ "u_has_trait": "CNPC_MUT_CnpcFlag" })){
		//释放检测血量法术判断是否击中目标
		eobj({"u_cast_spell":{"id":"CNPC_SPELL_CheckCurrHP_Range"}})

		//通用攻击事件
		CNPC_EOC_HitEvent()

		//运行动态生成的 造成远程攻击 事件eoc
		CNPC_EOC_CharCauseRangeHit()

		hasTarget=0; //重置flag
		eobj({"u_cast_spell":{"id":"CNPC_SPELL_KillSpellTarget"}}) //清理标靶
	}
}

//尝试攻击触发的eoc
function CNPC_EOC_HitEvent(){
	eoc_type("ACTIVATION")

	//设置不在待机
	u_notIdleOrMove=4;

	//尝试向标靶施放测试法术
	//eobj({
	//	"u_cast_spell":{"id":"CNPC_SPELL_TestConeSpell"},
	//	"targeted":true
	//})

	//运行动态生成的 造成攻击 事件eoc
	CNPC_EOC_CharCauseHit()
}

//生成基础npc
function CNPC_EOC_SpawnBaseNpc(){
	eobj({
		"u_spawn_npc": "CNPC_NPC_BaseNpc",
		"real_count": 1,
		"min_radius": 1,
		"max_radius": 1,
		"spawn_message": "生成了一个基础NPC"
	})
	eobj({
		"id": "asuna",
		"sound_effect": "skill",
		"volume": 100,
	})
}

//主循环函数 玩家
function CNPC_EOC_PlayerUpdateEvent(){
	recurrence(1);

	//记录坐标
	eobj({"u_location_variable":{"global_val":"avatar_loc"}});

	//刷新怪物血量
	eobj({ "u_cast_spell": { "id": "CNPC_SPELL_InitCurrHP" } })
	//CNPC_EOC_UpdateStat();
	//print_global_val(mag3);
	//print_global_val(mag1);
	//print_global_val(mag2);
	//运行动态生成的事件eoc
	CNPC_EOC_PlayerUpdate();
}

//主循环函数 全局
function CNPC_EOC_GlobalUpdateEvent(){
	recurrence(1);
	global(true);
	run_for_npcs(true);
	if(eobj({ "u_has_trait": "CNPC_MUT_CnpcFlag" })){

		if(u_isInit!=1){
			//添加用于防止逃跑的勇气效果
			eobj({ "u_add_effect": "CNPC_EFF_Courage", "duration": "PERMANENT" })
			//运行动态生成的事件eoc
			CNPC_EOC_CharInit();
			u_isInit=1;
		}

		//刷新属性
		CNPC_EOC_UpdateStat();
		//运行动态生成的事件eoc
		CNPC_EOC_CharUpdate();

		//附近有怪物 u_search_radius 无效
		if(eobj({ "math": [ "u_monsters_nearby('radius': 20 )", ">=", "1" ] })){
			//触发战斗中
			//运行动态生成的事件eoc
			CNPC_EOC_CharBattleUpdate();
		}


		//通过比较 loc字符串 检测移动
		eobj({
			"set_string_var": { "u_val": "u_char_preloc" },
			"target_var": { "global_val": "char_preloc" }
		})
		if(eobj({
			"compare_string": [
				{ "global_val": "char_preloc" },
				{ "mutator": "loc_relative_u", "target": "(0,0,0)" }
			]
		})){
			//设置在待机
			u_onMove=0;
		} else{
			//设置在移动
			u_onMove=1;
		}
		//更新 loc字符串
		eobj({"u_location_variable":{"u_val":"u_char_preloc"}});

		//如果不在做其他短时动作
		if(u_notIdleOrMove<=0){
			u_notIdleOrMove=0;
			//触发移动事件
			if(u_onMove>=1){
				//运行动态生成的事件eoc
				CNPC_EOC_CharMove();
			}else{//触发待机
				//运行动态生成的事件eoc
				CNPC_EOC_CharIdle();
			}
		}
		u_notIdleOrMove=u_notIdleOrMove-1;
	}
	else if(not(eobj({ "u_has_trait": "CNPC_MUT_BaseBody" })))
		eobj({ "u_add_trait": "CNPC_MUT_BaseBody" }) //如果不是cnpc单位则添加替代素体
}





//recurrence(1);
//global(false);
//run_for_npcs(false);




