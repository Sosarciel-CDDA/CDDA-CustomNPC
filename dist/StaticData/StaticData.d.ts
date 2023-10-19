import { JArray } from '@zwa73/utils';
export declare const StaticDataMap: Record<string, JArray>;
/**保存静态数据 */
export declare function saveStaticData(data: JArray, filePath: string, ...filePaths: string[]): Promise<void>;
