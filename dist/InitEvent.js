"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitEventManager = void 0;
async function InitEventManager(dm) {
    dm.addInvokeID("Init", 0, "CNPC_EOC_InitEvent");
    dm.addInvokeID("AvatarMove", 0, "CNPC_EOC_AvatarMoveEvent");
    dm.addInvokeID("AvatarUpdate", 0, "CNPC_EOC_AvatarUpdateEvent");
    dm.addInvokeID("Update", 0, "CNPC_EOC_UpdateEvent");
}
exports.InitEventManager = InitEventManager;
