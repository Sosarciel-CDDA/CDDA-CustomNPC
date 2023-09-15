import { BodyPartList } from "./CddaJsonFormat/GenericDefine";
import { Armor } from "./CddaJsonFormat/Item";
import { Mutation } from "./CddaJsonFormat/Mutattion";
import { DataManager } from "./DataManager";



export function createCharEquip(dm:DataManager,charName:string){
    const {baseData,outData} = dm.getCharData(charName);
    /**基础变异 */
    const baseMut:Mutation = {
        type            : "mutation",
        id              : baseData.baseMutID,
        name            : `${charName}的基础变异`,
        description     : `${charName}的基础变异`,
        points          : 0,
        restricts_gear  : [...BodyPartList],
        remove_rigid    : [...BodyPartList],
        integrated_armor: [baseData.baseArmorID]
    }
    /**基础装备 */
    const baseMutArmor:Armor={
        type        : "ARMOR",
        id          : baseData.baseArmorID,
        name        : `${charName}的基础装备`,
        description : `${charName}的基础装备`,
        category    : "clothing",
        weight      : 0,
        volume      : 0,
        symbol      : "O",
        flags       : ["PERSONAL","UNBREAKABLE","INTEGRATED","ZERO_WEIGHT","TARDIS"],
        pocket_data : [{
            rigid: true,
            pocket_type: "CONTAINER",
            max_contains_volume: "100 L",
            max_contains_weight: "100 kg",
            moves: 1,
            fire_protection: true,
            max_item_length: "1 km",
            weight_multiplier: 0,
            volume_multiplier: 0,
        }]
    }
    outData['equip'] = [baseMut,baseMutArmor];
}