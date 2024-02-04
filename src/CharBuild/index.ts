import { CDataManager } from "@src/DataManager";
import { getCharList } from "./CharData";
import { createCharCarry } from "./CharCarry";
import { createCharClass } from "./CharClass";
import { createCharEquip } from "./CharEquip";
import { createCharGener } from "./CharGener";
import { createCharTalkTopic } from "./CharTalkTopic";
import { createCharSkill } from "./CharSkill";
import { createDrawCardSpell } from "./DrawCardSpell";


/**创建角色 */
export async function createChar(dm:CDataManager){
    const charList = await getCharList();
    createDrawCardSpell(dm);
    for(const charName of charList){
        await createCharCarry(dm,charName);
        await createCharClass(dm,charName);
        await createCharEquip(dm,charName);
        await createCharGener(dm,charName);
        await createCharSkill(dm,charName);
        await createCharTalkTopic(dm,charName);
    }
}