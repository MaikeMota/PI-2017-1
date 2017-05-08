import { Enum } from '../../../../../RETHINK/core';

export class WaterInLetOpenTrigger extends Enum {

    constructor(name: string) {
        super(name);
    }

    public static readonly UNDER_HALF_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_HALF_VOLUME');
    public static readonly UNDER_MED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MED_VOLUME');
    public static readonly UNDER_MIN_VOUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MIN_VOUME');
    public static readonly UNDER_DEFINID_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_DEFINID_VOLUME');

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name
        });
    }
}