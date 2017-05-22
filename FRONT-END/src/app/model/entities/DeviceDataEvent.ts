import { Enum, Entity, typed } from '../../../../../RETHINK/core';
import { DeviceData } from './';
import { DeviceDataEventEnum } from '../enum/DeviceEventEnum'

export class DeviceDataEvent extends Entity {
    constructor() {
        super();
    }
    device_data_id: string;
    @typed
    event: DeviceDataEventEnum;
}