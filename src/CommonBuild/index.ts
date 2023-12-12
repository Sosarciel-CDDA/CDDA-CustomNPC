import { DataManager } from "@src/DataManager";
import { createTest } from "./Test";
import { createTriggerEffect } from "./TriggerEffect";
import { createCommonItem } from "./CommonItem";
import { createDivinationSpell } from "./DivinationSpell";
import { createDrawCardSpell } from "./DrawCardSpell";
import { createDamageType } from "./CommonDamageType";
import { createTriggerFlag } from "./TriggerFlag";
import { createEnchItem } from "./EnchItem";


/**构建通用数据 */
export async function commonBuild(dm:DataManager){
    await createTest(dm);
    await createTriggerEffect(dm);
    await createCommonItem(dm);
    await createDivinationSpell(dm);
    await createDrawCardSpell(dm);
    await createDamageType(dm);
    await createTriggerFlag(dm);
    await createEnchItem(dm);
}