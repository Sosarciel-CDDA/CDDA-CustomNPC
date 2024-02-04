"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonBuild = void 0;
const Test_1 = require("./Test");
const TriggerEffect_1 = require("./TriggerEffect");
const TriggerFlag_1 = require("./TriggerFlag");
/**构建通用数据 */
async function commonBuild(dm) {
    await (0, Test_1.createTest)(dm);
    await (0, TriggerEffect_1.createTriggerEffect)(dm);
    await (0, TriggerFlag_1.createTriggerFlag)(dm);
}
exports.commonBuild = commonBuild;
