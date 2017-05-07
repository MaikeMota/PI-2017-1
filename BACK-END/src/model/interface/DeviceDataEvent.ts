import { Enum } from '../../api/rethink/core';
import { EntityInstance, Entity, DeviceData } from './';
import { DeviceDataEventEnum } from '../DeviceEventEnum'

export interface DeviceDataEventInstance extends EntityInstance<DeviceDataEvent> {
}

export class DeviceDataEvent extends Entity {
    constructor() {
        super();
    }
    deviceData: DeviceData;
    event: DeviceDataEventEnum;
}


