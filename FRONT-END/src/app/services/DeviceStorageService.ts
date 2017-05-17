import { Injectable } from '@angular/core';

import { Device } from '../model/entities/Device';
import { DeviceData } from '../model/entities/DeviceData';
import { DeviceDataEvent } from '../model/entities/DeviceDataEvent';

@Injectable()
export class DeviceStorageService {

    public devices: Device[];

    constructor() {
        this.devices = [];
    }

    public getDevice(id: string) {
        return this.devices.filter((device, index) => {
            return device.id.toString() === id.toString(); // workaround to fill
        })[0];
    }

    public addOrUpdateDevice(device: Device) {
        let deviceIndex = this.devices.indexOf(device);
        device.data = device.data.reverse(); // newest first
        if (deviceIndex < 0) {
            this.devices.push(device);
        } else {
            this.devices[deviceIndex] = device;
        }
    }

    public addDataToDevice(id: string, deviceData: DeviceData) {
        this.getDevice(id).data.unshift(deviceData);
    }

    public deleteDevice(device: Device): void {
        let deviceIndex = this.devices.indexOf(this.getDevice(device.id));
        if (deviceIndex >= 0) {
            this.devices.splice(deviceIndex, 1);
        }
    }

    public clear(): void {
        this.devices = [];
    }

}