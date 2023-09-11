import { JToken } from '@zwa73/utils';
/**静态数据的目录 */
export declare const StaticDataPath: string;
/**保存静态数据 */
export declare function saveStaticData(name: string, data: JToken): Promise<void>;
