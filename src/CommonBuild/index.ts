import { CDataManager } from "@src/DataManager";
import { createTest } from "./Test";
import { createTriggerEffect } from "./TriggerEffect";
import { createTriggerFlag } from "./TriggerFlag";


/**构建通用数据 */
export async function commonBuild(dm:CDataManager){
    await createTest(dm);
    await createTriggerEffect(dm);
    await createTriggerFlag(dm);
}