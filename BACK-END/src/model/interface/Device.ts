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
    open_water_inlet_under_level: number;
    close_water_inlet_above_level: number;

    public static extractConfig(device: Device): string {
        let config: string = "";

        config = `${device.min_water_level},${device.med_water_level},${device.max_water_level},${device.recipient_radius}`
        config = `${config},${device.recipient_height},${device.open_water_inlet_under_level}, ${device.close_water_inlet_above_level}`;
        config = `${config},${WaterInLetOpenTrigger.ordinal(device.water_inlet_open_trigger)},${WaterInLetCloseTrigger.ordinal(device.water_inlet_close_trigger)}`;

        return config;
    }
}

export class WaterInLetOpenTrigger extends Enum {

    public static readonly UNDER_HALF_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_HALF_VOLUME', {
        "pt-BR": "Abaixo da Metade do Volume"
    });
    public static readonly UNDER_MED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MED_VOLUME', {
        "pt-BR": "Abaixo do Volume Médio"
    });
    public static readonly UNDER_MIN_VOUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_MIN_VOUME', {
        "pt-BR": "Abaixo do Volume Mínimo"
    });
    public static readonly UNDER_DEFINID_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger('UNDER_DEFINID_VOLUME', {
        "pt-BR": "Abaixo do Volume Definido"
    });

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name;
        });
    }

}
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
            return value.name;
        });
    }
}
