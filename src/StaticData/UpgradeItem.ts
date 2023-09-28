import { AmmunitionType, Eoc, Generic, Spell } from "CddaJsonFormat";
import { genAmmuTypeID, genEOCID, genGenericID, genSpellID } from "@src/ModDefine";
import { saveStaticData } from "./StaticData";
import { BATTLE_RANGE, CON_SPELL_FLAG } from "./BaseSpell";


/**经验物品ID */
export const SOUL_DUST_ID = genGenericID("SoulDust");

/**使用灵魂之尘的eocid */
const UseSoulDustEocID = genEOCID("UseSoulDust");
/**使用灵魂之尘的法术id */
const UseSoulDustSpellID = genSpellID("UseSoulDust");

/**升级法术 */
const UseSoulDust:Spell={
    type:"SPELL",
    name:"使用灵魂之尘",
    description:"使用灵魂之尘触发的法术",
    effect:"effect_on_condition",
    effect_str:UseSoulDustEocID,
    valid_targets:["ally"],
    min_range:BATTLE_RANGE,
    shape:"blast",
    id:UseSoulDustSpellID,
    flags:[...CON_SPELL_FLAG],
}

/**经验物品 */
const SoulDust:Generic={
    type:"GENERIC",
    id:SOUL_DUST_ID,
    name:{str_sp:"灵魂之尘"},
    description:"用于给角色提升经验",
    volume:0,
    weight:0,
    symbol:"O",
    flags:["ZERO_WEIGHT","UNBREAKABLE"],
    looks_like: "crystallized_mana"
}

/**升级道具 */
export const UpgradeItem = [SoulDust,UseSoulDust];
saveStaticData("UpgradeItem",UpgradeItem);