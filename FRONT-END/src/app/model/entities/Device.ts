import { Enum, Entity } from '../../../../../RETHINK/core';
import { typed } from '../../../../../RETHINK/core/annotation';
import { DeviceData } from './';
import { WaterInLetCloseTrigger, WaterInLetOpenTrigger } from '../enum';

export class Device extends Entity {
    device_key: string;
    description: string;
    min_water_level: number;
    med_water_level: number;
    max_water_level: number;
    recipient_radius: number;
    recipient_height: number;
    @typed
    water_inlet_open_trigger: WaterInLetOpenTrigger;
    @typed
    water_inlet_close_trigger: WaterInLetCloseTrigger;
    open_water_inlet_under_level: number;
    close_water_inlet_above_level: number;
    @Reflect.metadata('design:arrayType', DeviceData)
    data: DeviceData[] = [];
}