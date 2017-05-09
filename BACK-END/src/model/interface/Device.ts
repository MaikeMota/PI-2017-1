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
    water_inlet_open_trigger: string;
    water_inlet_close_trigger: string;

    public static extractConfig(device: Device): string {
        let config: string = "";

        config = `${device.min_water_level},${device.med_water_level},${device.max_water_level},${device.recipient_radius}`
        config = `${config},${device.recipient_height},${WaterInLetOpenTrigger.ordinal(device.water_inlet_open_trigger)}`
        config = `${config},${WaterInLetCloseTrigger.ordinal(device.water_inlet_close_trigger)}`;

        return config;
    }
}

export class WaterInLetOpenTrigger extends Enum {

    constructor(name: string) {
        super(name);
    }

    public static readonly UNDER_HALF_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_HALF_VOLUME');
    public static readonly UNDER_MED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MED_VOLUME');
    public static readonly UNDER_MIN_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MIN_VOLUME');
    public static readonly UNDER_DEFINED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_DEFINED_VOLUME');

    public static values(): WaterInLetOpenTrigger[] {
        return [
            WaterInLetOpenTrigger.UNDER_HALF_VOLUME,
            WaterInLetOpenTrigger.UNDER_MED_VOLUME,
            WaterInLetOpenTrigger.UNDER_MIN_VOLUME,
            WaterInLetOpenTrigger.UNDER_DEFINED_VOLUME,
        ]
    }

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name;
        });
    }

}
export class WaterInLetCloseTrigger extends Enum {
    constructor(name: string) {
        super(name);
    }

    public static readonly ABOVE_HALF_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_HALF_VOLUME');
    public static readonly ABOVE_MED_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_MED_VOLUME');
    public static readonly ABOVE_MIN_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_MIN_VOLUME');
    public static readonly ABOVE_DEFINED_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger('ABOVE_DEFINED_VOLUME');

    public static values(): WaterInLetCloseTrigger[] {
        return [
            WaterInLetCloseTrigger.ABOVE_HALF_VOLUME,
            WaterInLetCloseTrigger.ABOVE_MED_VOLUME,
            WaterInLetCloseTrigger.ABOVE_MIN_VOLUME,
            WaterInLetCloseTrigger.ABOVE_DEFINED_VOLUME,
        ]
    }

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name;
        });
    }
}
