

function print_global_val(varName){
	eobj( { u_message: "全局变量 "+varName+" 当前的值为 : <global_val:"+varName+">" })
	//eobj( { u_message: {global_val:varName}})
}

function update_stat(){
	//recurrence("1 s");
	//print_global_val(mag3);
	//print_global_val(mag1);
	//print_global_val(mag2);
}


//初始化现有血量
function CNPC_EOC_InitCurrHP(){
	eoc_type("ACTIVATION")
	if(u_currhp==0)
		u_currhp = u_hp();
}
//刷新现有血量
function CNPC_EOC_UpdateInitCurrHP(){
	recurrence(1);
	eobj({ "u_cast_spell": { "id": "CNPC_SPELL_InitCurrHP" } })
}

//检测现有血量并触发get_hit
function CNPC_EOC_CheckCurrHP(){
	eoc_type("ACTIVATION")
	mag1 = u_currhp;
	mag2 = u_hp();
	if(and(u_currhp > u_hp(),has_target==0)){
		eobj({ "u_cast_spell": { "id": "CNPC_SPELL_SummonTarget" } })
		has_target=1;
	}
	u_currhp = u_hp();
}

//尝试攻击触发的eoc
function CNPC_EOC_HitEocs(){
	eoc_type("ACTIVATION")
	eobj({"u_cast_spell":{"id":"CNPC_SPELL_CheckCurrHP"}})
	has_target=0;
	eobj({
		"u_cast_spell":{"id":"CNPC_SPELL_TestConeSpell"},
		"targeted":true
	})
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
}







//recurrence(1);
//global(false);
//run_for_npcs(false);




