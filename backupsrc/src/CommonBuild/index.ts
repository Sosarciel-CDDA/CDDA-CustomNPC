import { CDataManager } from "@src/DataManager";
import { createTest } from "./Test";
import { createTriggerEffect } from "./TriggerEffect";
import { createCommonItem } from "./CommonItem";
import { createDivinationSpell } from "./DivinationSpell";
import { createDrawCardSpell } from "./DrawCardSpell";
import { createTriggerFlag } from "./TriggerFlag";


/**构建通用数据 */
export async function commonBuild(dm:CDataManager){
    await createTest(dm);
    await createTriggerEffect(dm);
    await createCommonItem(dm);
    await createDivinationSpell(dm);
    await createDrawCardSpell(dm);
    await createTriggerFlag(dm);
}