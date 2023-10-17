"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modinfo = void 0;
const StaticData_1 = require("./StaticData");
exports.modinfo = [
    {
        "type": "MOD_INFO",
        "id": "cnpc",
        "name": "CustomNPC",
        "authors": ["zwa73"],
        "maintainers": ["zwa73"],
        "description": "CustomNPC",
        "category": "other",
        "dependencies": ["dda", "aftershock", "magiclysm"]
    }
];
(0, StaticData_1.saveStaticData)(exports.modinfo, 'modinfo');
