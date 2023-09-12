"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const Data_1 = require("./Data");
const MergeImage_1 = require("./MergeImage");
async function build(charName) {
    const charPath = (0, Data_1.getCharPath)(charName);
    await (0, MergeImage_1.mergeImage)(charName);
}
exports.build = build;
for (let charName of Data_1.CHAR_LIST) {
    build(charName);
}
__exportStar(require("./StaticData"), exports);
__exportStar(require("./CddaJsonFormat"), exports);
