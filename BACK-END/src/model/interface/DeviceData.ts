import { Entity, EntityAttributes, Device } from './';

export interface DeviceData extends Entity<DeviceDataAttributes> {
}

export interface DeviceDataAttributes extends EntityAttributes {
    waterLevel: number;
    waterInletFlux: number;
    waterOutFlux: number;
    device: Device;
}

