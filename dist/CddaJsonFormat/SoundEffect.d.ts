import { CddaID } from "./GenericDefine";
/**音效ID */
export type SoundEffectID = CddaID<"SE">;
/**音效变体ID */
export type SoundEffectVariantID = CddaID<"SEV">;
/**音效 */
export type SoundEffect = {
    type: "sound_effect";
    /**音效ID */
    id: SoundEffectID;
    /**音效变体ID */
    variant: SoundEffectVariantID;
    /**音量 */
    volume: number;
    /**文件路径 从音效包起始 */
    files: string[];
};
