import { JObject } from '@zwa73/utils';
export declare const StaticDataMap: Record<string, JObject[]>;
/**保存静态数据 */
export declare function saveStaticData(data: JObject[], filePath: string, ...filePaths: string[]): Promise<void>;
