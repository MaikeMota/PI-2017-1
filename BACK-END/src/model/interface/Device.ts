import { Enum, Entity, EnumInfo } from '../../../../RETHINK/core';
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
        config = `${config},${WaterInLetOpenTrigger.parse<WaterInLetOpenTrigger>(device.water_inlet_open_trigger).ordinal}`;
        config = `${config},${WaterInLetCloseTrigger.parse<WaterInLetCloseTrigger>(device.water_inlet_close_trigger).ordinal}`;

        return config;
    }
}

export class WaterInLetOpenTrigger extends Enum {

    private _ordinal: number;

    constructor(ordinal: number, name: string, enumInfo: EnumInfo) {
        super(name, enumInfo);
        this._ordinal = ordinal;
    }

    public static readonly UNDER_HALF_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger(0, 'UNDER_HALF_VOLUME', {
        "pt-BR": "Abaixo da Metade do Volume"
    });
    public static readonly UNDER_MED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger(1, 'UNDER_MED_VOLUME', {
        "pt-BR": "Abaixo do Volume Médio"
    });
    public static readonly UNDER_MIN_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger(2, 'UNDER_MIN_VOLUME', {
        "pt-BR": "Abaixo do Volume Mínimo"
    });
    public static readonly UNDER_DEFINED_VOLUME: WaterInLetOpenTrigger = new WaterInLetOpenTrigger(3, 'UNDER_DEFINED_VOLUME', {
        "pt-BR": "Abaixo do Volume Definido"
    });

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name;
        });
    }

    public get ordinal(): number {
        return this._ordinal;
    }

}
export class WaterInLetCloseTrigger extends Enum {

    private _ordinal: number;

    constructor(ordinal: number, name: string, enumInfo: EnumInfo) {
        super(name, enumInfo);
        this._ordinal = ordinal;
    }

    public static readonly ABOVE_HALF_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger(0, 'ABOVE_HALF_VOLUME', {
        "pt-BR": "Acima da Metade do Volume"
    });
    public static readonly ABOVE_MED_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger(1, 'ABOVE_MED_VOLUME', {
        "pt-BR": "Acima do Volume Médio"
    });
    public static readonly ABOVE_MIN_VOUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger(2, 'ABOVE_MIN_VOUME', {
        "pt-BR": "Acima do Volume Mínimo"
    });
    public static readonly ABOVE_DEFINED_VOLUME: WaterInLetCloseTrigger = new WaterInLetCloseTrigger(3, 'ABOVE_DEFINED_VOLUME', {
        "pt-BR": "Acima do Volume Definido"
    });

    public static valuesAsString(): string[] {
        return this.values().map((value) => {
            return value.name;
        });
    }

    public get ordinal(): number {
        return this._ordinal;
    }
}
