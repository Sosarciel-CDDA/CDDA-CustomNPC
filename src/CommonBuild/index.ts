import { DataManager } from "@src/DataManager";
import { createTest } from "./Test";
import { createTriggerEffect } from "./TriggerEffect";
import { createCommonItem } from "./CommonItem";
import { createDivinationSpell } from "./DivinationSpell";
import { createDetonateTearSpell } from "./DetonateTearSpell";
import { createDamageType } from "./CommonDamageType";


/**构建通用数据 */
export async function commonBuild(dm:DataManager){
    await createTest(dm);
    await createTriggerEffect(dm);
    await createCommonItem(dm);
    await createDivinationSpell(dm);
    await createDetonateTearSpell(dm);
    await createDamageType(dm);
}