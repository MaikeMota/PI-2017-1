import { Enum } from '../../../../../RETHINK/core';

export class WaterInLetOpenTrigger extends Enum {

    public static readonly UNDER_HALF_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_HALF_VOLUME', {
        "pt-BR": "Abaixo da Metade do Volume"
    });
    public static readonly UNDER_MED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MED_VOLUME', {
        "pt-BR": "Abaixo do Volume Médio"
    });
    public static readonly UNDER_MIN_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MIN_VOLUME', {
        "pt-BR": "Abaixo do Volume Mínimo"
    });
    public static readonly UNDER_DEFINED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_DEFINED_VOLUME', {
        "pt-BR": "Abaixo do Volume Definido"
    });

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name
        });
    }
}