import { JObject, JToken } from '@zwa73/utils';
export declare const StaticDataMap: JObject;
/**保存静态数据 */
export declare function saveStaticData(name: string, data: JToken): Promise<void>;
