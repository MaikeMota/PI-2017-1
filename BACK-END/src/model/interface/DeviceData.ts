import { EntityInstance, Device } from './';
import { Enum, Entity } from '../../../../RETHINK/core';
import { DeviceDataEvent } from "./DeviceDataEvent";

export interface DeviceDataInstance extends EntityInstance<DeviceData> {
}

export class DeviceData extends Entity {

    constructor() {
        super();
    }

    public water_level: number;
    public water_inlet_flux: number;
    public water_out_flux: number;
    public device_id: string;
    public events: DeviceDataEvent[] = [];

}

