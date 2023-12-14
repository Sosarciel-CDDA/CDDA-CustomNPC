
import { AnyString, JObject, UtilFT, UtilFunc } from "@zwa73/utils";
import { AnyHook, genEventEoc, GlobalHook} from "./EventInterface";
import { Eoc, EocEffect, EocID } from "cdda-schema";


/**事件效果 */
type EventEffect = {
    /**eoc效果 */
    effects:EocEffect[];
    /**排序权重 */
    weight:number;
}
export class EventManager {
    private _eocMap:Record<AnyHook|AnyString,Eoc>;
    private _effectsMap:Partial<Record<AnyHook|AnyString,EventEffect[]>> = {};

    constructor(prefix:string){
        this._eocMap=genEventEoc(prefix);
    }
    /**导出 */
    build(){
        const json:JObject[] = [];
        //加入effect
        const eocmap = UtilFunc.deepClone(this._eocMap);
        for(const key in eocmap){
            const fixkey = key as AnyHook;
            const eoc = eocmap[fixkey];
            //加入effect
            eoc.effect = eoc.effect??[];
            let elist = this._effectsMap[fixkey]||[];
            elist.sort((a,b)=>b.weight-a.weight);
            const eventeffects:EocEffect[] = [];
            elist.forEach((e)=>eventeffects.push(...e.effects));
            eoc.effect.unshift(...eventeffects);
            //整合eoc数组
            json.push(eoc);
        }
        return json;
    }
    /**添加事件 */
    addEvent(hook:AnyHook|AnyString,weight:number,effects:EocEffect[]){
        this.verifyHook(hook);
        this._effectsMap[hook] = this._effectsMap[hook]??[];
        const list = this._effectsMap[hook];
        list?.push({effects,weight})
    }
    /**添加调用eoc事件 */
    addInvoke(hook:AnyHook|AnyString,weight:number,...eocids:EocID[]){
        this.verifyHook(hook);
        this._effectsMap[hook] = this._effectsMap[hook]??[];
        const list = this._effectsMap[hook];
        list?.push({effects:[{run_eocs:eocids}],weight})
    }
    /**添加自定义的Hook */
    addHook(hook:string,eoc:Eoc){
        this._eocMap[hook] = eoc;
    }
    /**验证hook是否存在 */
    private verifyHook(hook:string){
        if(this._eocMap[hook]==null) throw `hook:${hook} 不存在`;
    }
}