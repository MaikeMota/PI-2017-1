import { Enum, Entity } from '../../../../RETHINK/core';
import { EntityInstance, DeviceData } from './';

export interface DeviceInstance extends EntityInstance<Device> {
}

export class Device extends Entity {

    constructor() {
        super();
    }
    
    device_key: string;
    description: string;
    min_water_level: number;
    med_water_level: number;
    max_water_level: number;
    recipient_radius: number;
    recipient_height: number;
    water_inlet_open_trigger: WaterInLetOpenTrigger;
    water_inlet_close_trigger: WaterInLetCloseTrigger;
}

export class WaterInLetOpenTrigger extends Enum {

    constructor(name: string) {
        super(name);
    }

    public static readonly UNDER_HALF_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_HALF_VOLUME');
    public static readonly UNDER_MED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MED_VOLUME');
    public static readonly UNDER_MIN_VOUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MIN_VOUME');
    public static readonly UNDER_DEFINID_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_DEFINID_VOLUME');

    public static values(): WaterInLetOpenTrigger[] {
        return [
            WaterInLetOpenTrigger.UNDER_HALF_VOLUME,
            WaterInLetOpenTrigger.UNDER_MED_VOLUME,
            WaterInLetOpenTrigger.UNDER_MIN_VOUME,
            WaterInLetOpenTrigger.UNDER_DEFINID_VOLUME,
        ]
    }

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name
        });
    }

}
export class WaterInLetCloseTrigger extends Enum {
    constructor(name: string) {
        super(name);
    }

    public static readonly ABOVE_HALF_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('ABOVE_HALF_VOLUME');
    public static readonly ABOVE_MED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('ABOVE_MED_VOLUME');
    public static readonly ABOVE_MIN_VOUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('ABOVE_MIN_VOUME');
    public static readonly ABOVE_DEFINID_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('ABOVE_DEFINID_VOLUME');

    public static values(): WaterInLetOpenTrigger[] {
        return [
            WaterInLetCloseTrigger.ABOVE_HALF_VOLUME,
            WaterInLetCloseTrigger.ABOVE_MED_VOLUME,
            WaterInLetCloseTrigger.ABOVE_MIN_VOUME,
            WaterInLetCloseTrigger.ABOVE_DEFINID_VOLUME,
        ]
    }

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name
        });
    }
}
