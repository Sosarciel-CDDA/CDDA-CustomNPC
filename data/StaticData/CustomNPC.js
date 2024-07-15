



//———————————————————— 其他 ————————————————————//

function u_print(text){
	eoc_type("ACTIVATION")
	eobj( { u_message: text+"" })
	//eobj( { u_message: {global_val:varName}})
}

function print_global_val(varName){
	eoc_type("ACTIVATION")
	eobj( { u_message: "全局变量 "+varName+" 当前的值为 : <global_val:"+varName+">" })
	//eobj( { u_message: {global_val:varName}})
}

function CNPC_EOC_UpdateStat(){
	eoc_type("ACTIVATION")
	//print_global_val(Asuna_level);
	//recurrence("1 s");

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

//死亡
function CNPC_EOC_DeathEvent(){
	eoc_type("ACTIVATION");
	if(u_isDeath != 1){
		//触发动态生成的 死亡 事件
		CNPC_EOC_Death();
		if(eobj({ "u_has_trait": "CNPC_MUT_CnpcFlag" }))
			CNPC_EOC_CnpcDeathProcess();
	}
}
//初始化
function CNPC_EOC_InitEvent(){
	eoc_type("ACTIVATION");
	//添加属性增强变异
	if(not(eobj({ "u_has_trait": "CNPC_MUT_StatMod" })))
		eobj({ "u_add_trait": "CNPC_MUT_StatMod" })
	//添加用于防止逃跑的勇气效果
	eobj({ "u_add_effect": "CNPC_EFF_Courage", "duration": "PERMANENT" })
}

//玩家移动
function CNPC_EOC_AvatarMoveEvent(){
	eoc_type("ACTIVATION")
	//记录坐标
	eobj({"u_location_variable":{"global_val":"avatar_loc"}});
}
//玩家刷新
function CNPC_EOC_AvatarUpdateEvent(){
	eoc_type("ACTIVATION");
	//刷新属性
	CNPC_EOC_UpdateStat();

	//记录坐标
	eobj({"u_location_variable":{"global_val":"avatar_loc"}});
}
//刷新
function CNPC_EOC_UpdateEvent(){
	eoc_type("ACTIVATION");
	if(u_isDeath!=1){
		//Cnpc角色刷新
		if(eobj({ "u_has_trait": "CNPC_MUT_CnpcFlag" }))
			CNPC_EOC_CnpcUpdateEvent();
	}//如果含有已经死亡标记则触发死亡后处理
	else if(eobj({ "u_has_trait": "CNPC_MUT_CnpcFlag" })){
		eobj({"run_eoc_with":"CNPC_EOC_CnpcDeathAfterProcess","beta_loc":{"global_val":"avatar_loc"}})
	}
}


//———————————————————— Cnpc事件处理 ————————————————————//
//CNPC死亡事件
//Cnpc角色受伤死亡处理
function CNPC_EOC_CnpcDeathProcess(){
	eoc_type("ACTIVATION")

	eobj("u_prevent_death")//阻止死亡

	//眩晕附近怪物防止无形体受击报错
	eobj({ "u_cast_spell": { "id": "CNPC_SPELL_DeathStunned" } });
	//丢下武器
	if(eobj("u_can_drop_weapon")){
		eobj({u_location_variable:{global_val:"tmp_loc"}});
		eobj({run_eoc_with:{
				id:`CNPC_EOC_DeathAfterProcess_Sub`,
				eoc_type:"ACTIVATION",
				effect:["drop_weapon"]
			},beta_loc:{"global_val":"tmp_loc"}}//把自己设为betaloc防止报错
		)
	}
	//无形体
	eobj({ "u_add_effect":"incorporeal","duration":"PERMANENT","force":true});
	//完全回复
	CNPC_EOC_FullRecovery();
	//眩晕倒地
	eobj({ "u_add_effect":"stunned","duration":"PERMANENT","force":true});
	eobj({ "u_add_effect":"downed" ,"duration":"PERMANENT","force":true});
	eobj({ "u_add_trait": "DEBUG_NODMG" });
	eobj({ "u_add_trait": "DEBUG_CLOAK" });
	eobj({ "u_add_trait": "DEBUG_SPEED" });
	u_isDeath = 1;
}

//死亡后处理
function CNPC_EOC_CnpcDeathAfterProcess(){
	eoc_type("ACTIVATION")
	//传送
	eobj({u_location_variable:{global_val:"tmp_loc"},z_adjust:-10,z_override:true})
    eobj({u_teleport:{global_val:"tmp_loc"},force:true})
	//npc传送会使玩家一起传送 需要将玩家传送回原地
    eobj({npc_teleport:{global_val:"avatar_loc"},force:true})
    eobj({math:["u_hp('ALL')","=","0"]})
}






