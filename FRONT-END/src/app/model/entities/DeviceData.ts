import { Device } from './';
import { Enum, Entity } from '../../../../../RETHINK/core';
import { DeviceDataEvent } from "./DeviceDataEvent";

export class DeviceData extends Entity {

    constructor() {
        super();
    }
    
    public water_level: number;
    public water_inlet_flux: number;
    public water_out_flux: number;
    public device_id: string;
    @Reflect.metadata('design:arrayType', DeviceDataEvent)
    public events: DeviceDataEvent[] = [];
}

