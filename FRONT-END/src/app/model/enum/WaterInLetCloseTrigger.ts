import { Enum } from '../../../../../RETHINK/core';

export class WaterInLetCloseTrigger extends Enum {

    public static readonly ABOVE_HALF_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_HALF_VOLUME', {
        "pt-BR": "Acima da Metade do Volume"
    });
    public static readonly ABOVE_MED_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_MED_VOLUME', {
        "pt-BR": "Acima do Volume Médio"
    });
    public static readonly ABOVE_MIN_VOUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_MIN_VOUME', {
        "pt-BR": "Acima do Volume Mínimo"
    });
    public static readonly ABOVE_DEFINID_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_DEFINID_VOLUME', {
        "pt-BR": "Acima do Volume Definido"
    });

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name
        });
    }
}