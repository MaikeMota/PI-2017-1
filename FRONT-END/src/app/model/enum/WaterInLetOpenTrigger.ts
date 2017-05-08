import { Enum } from '../../../../../RETHINK/core';

export class WaterInLetOpenTrigger extends Enum {

    public static readonly UNDER_HALF_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_HALF_VOLUME', {
        "pt-BR": "Abaixo do Volume Médio"
    });
    public static readonly UNDER_MED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MED_VOLUME', {
        "pt-BR": "Abaixo do Volume Médio"
    });
    public static readonly UNDER_MIN_VOUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MIN_VOUME', {
        "pt-BR": "Abaixo do Volume Médio"
    });
    public static readonly UNDER_DEFINID_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_DEFINID_VOLUME', {
        "pt-BR": "Abaixo do Volume Médio"
    });

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name
        });
    }
}