import { EntityInstance, Entity, Device } from './';

export interface DeviceDataInstance extends EntityInstance<DeviceData> {
}

export class DeviceData extends Entity {

    constructor() {
        super();
    }

    public waterLevel: number;
    public waterInletFlux: number;
    public waterOutFlux: number;
    public device: Device;
}

