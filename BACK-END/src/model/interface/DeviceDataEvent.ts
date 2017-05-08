import { Enum, Entity } from '../../../../RETHINK/core';
import { EntityInstance, DeviceData } from './';
import { DeviceDataEventEnum } from '../DeviceEventEnum'

export interface DeviceDataEventInstance extends EntityInstance<DeviceDataEvent> {
}

export class DeviceDataEvent extends Entity {
    constructor() {
        super();
    }
    device_data_id: string;
    event: string;
}


