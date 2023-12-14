import { JObject } from "@zwa73/utils";
import { AnyEventType } from "./EventInterface";
import { EocEffect, EocID } from "@/cdda-schema";
export declare class EventManager {
    private _eocMap;
    private _effectsMap;
    constructor(prefix: string);
    /**导出 */
    build(): JObject[];
    /**添加事件 */
    addEvent(etype: AnyEventType, weight: number, effects: EocEffect[]): void;
    /**添加调用eoc事件 */
    addInvoke(etype: AnyEventType, weight: number, ...eocids: EocID[]): void;
}
