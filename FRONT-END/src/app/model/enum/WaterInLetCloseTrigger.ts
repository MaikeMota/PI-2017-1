import { Enum } from '../../../../../RETHINK/core';

export class WaterInLetCloseTrigger extends Enum {
    constructor(name: string) {
        super(name);
    }

    public static readonly ABOVE_HALF_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_HALF_VOLUME');
    public static readonly ABOVE_MED_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_MED_VOLUME');
    public static readonly ABOVE_MIN_VOUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_MIN_VOUME');
    public static readonly ABOVE_DEFINID_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_DEFINID_VOLUME');

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name
        });
    }
}