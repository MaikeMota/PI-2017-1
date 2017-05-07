import { Device } from './';
import { Enum, Entity } from '../../../../../RETHINK/core';

export class DeviceData extends Entity {

    constructor() {
        super();
    }
    
    public water_level: number;
    public water_inlet_flux: number;
    public water_out_flux: number;
    public device: Device;
}

