import { Enum, Entity } from '../../../../RETHINK/core';
import { EntityInstance, DeviceData } from './';
import { DeviceDataEventEnum } from '../DeviceEventEnum'

export interface DeviceDataEventInstance extends EntityInstance<DeviceDataEvent> {
}

export class DeviceDataEvent extends Entity {
    
    public device_data_id: string;
    public event: string;
}