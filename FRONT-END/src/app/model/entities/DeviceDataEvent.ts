import { Enum, Entity } from '../../../../../RETHINK/core';
import { DeviceData } from './';
import { DeviceDataEventEnum } from '../enum/DeviceEventEnum'

export class DeviceDataEvent extends Entity {
    constructor() {
        super();
    }
    deviceData: DeviceData;
    event: DeviceDataEventEnum;
}


