"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimStatus = exports.changeAnimEoc = exports.removeOtherAnimEoc = void 0;
const path = require("path");
const ModDefine_1 = require("../ModDefine");
function hasAnim(outData, animType) {
    return outData[path.join("anime", animType)];
}
/**移除其他动作变异 */
function removeOtherAnimEoc(charName, baseData, animType) {
    const otherAnim = baseData.validAnim.filter(item => item != animType);
    if (otherAnim.length <= 0)
        return null;
    const eoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(charName + "_RemoveOtherAnimEoc_" + animType),
        effect: [
            ...otherAnim.map(otherAnimType => ({
                u_lose_trait: baseData.animData[otherAnimType].mutID
            }))
        ]
    };
    return eoc;
}
exports.removeOtherAnimEoc = removeOtherAnimEoc;
/**切换动作EOC */
function changeAnimEoc(charName, baseData, animType) {
    const removeEoc = removeOtherAnimEoc(charName, baseData, animType);
    if (removeEoc == null)
        return [];
    const eoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)(charName + "_ChangeAnimEoc_" + animType),
        effect: [
            { "run_eocs": removeEoc.id },
            { "u_add_trait": baseData.animData[animType].mutID },
        ],
        condition: { not: { "u_has_trait": baseData.animData[animType].mutID } }
    };
    return [eoc, removeEoc];
}
exports.changeAnimEoc = changeAnimEoc;
/**创建动画状态机事件 */
async function createAnimStatus(dm, charName) {
    const { defineData, outData } = await dm.getCharData(charName);
    const eocList = [];
    const animEventMap = {
        Move: "MoveStatus",
        Attack: "TryAttack",
        Idle: "IdleStatus",
        //Death:"Death",
    };
    //添加切换动画
    for (const mtnName in animEventMap) {
        const animType = mtnName;
        if (hasAnim(outData, animType)) {
            let eocs = changeAnimEoc(charName, defineData, animType);
            eocList.push(...eocs);
            const eventName = animEventMap[animType];
            if (eventName != null && eocs != null && eocs.length > 0)
                dm.addCharEvent(charName, eventName, 0, eocs[0]);
        }
    }
    outData['anime_status'] = eocList;
}
exports.createAnimStatus = createAnimStatus;
