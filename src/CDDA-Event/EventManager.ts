
import { JObject, UtilFT, UtilFunc } from "@zwa73/utils";
import { AnyEventType, genEventEoc, GlobalEventType} from "./EventInterface";
import { Eoc, EocEffect, EocID } from "@/cdda-schema";


/**事件效果 */
type EventEffect = {
    /**eoc效果 */
    effects:EocEffect[];
    /**排序权重 */
    weight:number;
}
export class EventManager {
    private _eocMap:Record<AnyEventType,Eoc>;
    private _effectsMap:Partial<Record<AnyEventType,EventEffect[]>> = {};
    constructor(prefix:string){
        this._eocMap=genEventEoc(prefix);
    }
    /**导出 */
    build(){
        const json:JObject[] = [];
        //加入effect
        const eocmap = UtilFunc.deepClone(this._eocMap);
        for(const key in eocmap){
            const fixkey = key as AnyEventType;
            const eoc = eocmap[fixkey];
            //加入effect
            eoc.effect = eoc.effect??[];
            let elist = this._effectsMap[fixkey]||[];
            elist.sort((a,b)=>b.weight-a.weight);
            const eventeffects:EocEffect[] = [];
            elist.forEach((e)=>eventeffects.push(...e.effects));
            eoc.effect.push(...eventeffects);
            //整合eoc数组
            json.push(eoc);
        }
        return json;
    }
    /**添加事件 */
    addEvent(etype:AnyEventType,weight:number,effects:EocEffect[]){
        this._effectsMap[etype] = this._effectsMap[etype]??[];
        const list = this._effectsMap[etype];
        list?.push({effects,weight})
    }
    /**添加调用eoc事件 */
    addInvoke(etype:AnyEventType,weight:number,...eocids:EocID[]){
        this._effectsMap[etype] = this._effectsMap[etype]??[];
        const list = this._effectsMap[etype];
        list?.push({effects:[{run_eocs:eocids}],weight})
    }
}