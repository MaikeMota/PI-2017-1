import { Enum } from '../../api/rethink/core';
import { Entity, EntityAttributes, DeviceData } from './';
import { DeviceDataEventEnum } from '../DeviceEventEnum'

export interface DeviceDataEvent extends Entity<DeviceDataEventAttributes> {
}

export interface DeviceDataEventAttributes extends EntityAttributes {
    deviceData: DeviceData,
    event: DeviceDataEventEnum;
}


