import { DataManager } from "@sosarciel-cdda/event";



export async function InitEventManager(dm:DataManager) {
    dm.addInvokeID("Init"        , 0, "CNPC_EOC_InitEvent");
    dm.addInvokeID("AvatarMove"  , 0, "CNPC_EOC_AvatarMoveEvent");
    dm.addInvokeID("AvatarUpdate", 0, "CNPC_EOC_AvatarUpdateEvent");
    dm.addInvokeID("Update"      , 0, "CNPC_EOC_UpdateEvent");
    dm.addInvokeID("GameBegin"   , 0, "CNPC_EOC_GameBeginEvent");
}