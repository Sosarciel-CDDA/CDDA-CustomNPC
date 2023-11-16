import { saveStaticData } from "./StaticData";

export const modinfo = [
    {
        "type": "MOD_INFO",
        "id": "cnpc",
        "name": "CustomNPC",
        "authors": ["zwa73"],
        "maintainers": ["zwa73"],
        "description": "CustomNPC",
        "category": "other",
        "dependencies": ["dda","aftershock","magiclysm"]
    }
]
saveStaticData(modinfo,'modinfo');