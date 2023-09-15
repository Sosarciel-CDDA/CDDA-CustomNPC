"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimStatus = exports.changeAnimEoc = exports.removeOtherAnimEoc = void 0;
const path = require("path");
const ModDefine_1 = require("./ModDefine");
function hasAnim(outData, animType) {
    return outData[path.join("anim", animType)];
}
/**移除其他动作变异 */
function removeOtherAnimEoc(baseData, animType) {
    const otherAnim = baseData.vaildAnim.filter(item => item != animType);
    if (otherAnim.length <= 0)
        return null;
    const eoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)("RemoveOtherAnimEoc_" + animType),
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
function changeAnimEoc(baseData, animType) {
    const removeEoc = removeOtherAnimEoc(baseData, animType);
    if (removeEoc == null)
        return [];
    const eoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: (0, ModDefine_1.genEOCID)("ChangeAnimEoc_" + animType),
        effect: [
            { "run_eocs": (0, ModDefine_1.genEOCID)("RemoveOtherAnimEoc_" + animType) },
            { "u_add_trait": baseData.animData[animType].mutID },
        ],
        condition: { not: { "u_has_trait": baseData.animData[animType].mutID } }
    };
    return [eoc, removeEoc];
}
exports.changeAnimEoc = changeAnimEoc;
/**创建动画状态机 */
function createAnimStatus(dm, charName) {
    const { baseData, outData } = dm.getCharData(charName);
    const eocList = [];
    const animEventMap = {
        Move: "CharMove",
        Attack: "CharCauseHit",
        Idle: "CharIdle",
    };
    //添加切换动画
    for (const mtnName in animEventMap) {
        const animType = mtnName;
        if (hasAnim(outData, animType)) {
            let eocs = changeAnimEoc(baseData, animType);
            eocList.push(...eocs);
            const eventName = animEventMap[animType];
            if (eventName != null && eocs != null)
                dm.addEvent(eventName, eocs[0]);
        }
    }
    outData['anim_status'] = eocList;
}
exports.createAnimStatus = createAnimStatus;
