
import { AnyString, JObject, UtilFT, UtilFunc } from "@zwa73/utils";
import { AnyHook, genDefineHookMap, GlobalHook, HookObj} from "./EventInterface";
import { Eoc, EocEffect, EocID } from "cdda-schema";


/**事件效果 */
type EventEffect = {
    /**eoc效果 */
    effects:EocEffect[];
    /**排序权重 */
    weight:number;
}
export class EventManager {
    private _hookMap:Record<AnyHook|AnyString,HookObj>;
    private _effectsMap:Partial<Record<AnyHook|AnyString,EventEffect[]>> = {};
    private _prefix:string;
    constructor(prefix:string){
        this._hookMap=genDefineHookMap(prefix);
        this._prefix = prefix;
    }
    /**导出 */
    build(){
        const json:JObject[] = [];
        //加入effect
        for(const key in this._hookMap){
            const fixkey = key as AnyHook;
            const hookObj = this._hookMap[fixkey];
            //加入effect
            let elist = this._effectsMap[fixkey]||[];
            elist.sort((a,b)=>b.weight-a.weight);
            const eventeffects:EocEffect[] = [];
            elist.forEach((e)=>eventeffects.push(...e.effects));
            const eoc = {
                type:"effect_on_condition",
                ...hookObj.base_setting,
                id:`${this._prefix}_${key}_EVENT` as EocID,
                effect:[...hookObj.before_effects??[],...eventeffects,...hookObj.after_effects??[]]
            }
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
    addHook(hook:string,eoc:HookObj){
        this._hookMap[hook] = eoc;
    }
    /**验证hook是否存在 */
    private verifyHook(hook:string){
        if(this._hookMap[hook]==null) throw `hook:${hook} 不存在`;
    }
}