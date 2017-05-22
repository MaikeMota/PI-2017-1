import { Injectable } from '@angular/core';

import { Device } from '../model/entities/Device';
import { DeviceData } from '../model/entities/DeviceData';
import { DeviceDataEvent } from '../model/entities/DeviceDataEvent';
import { DeviceService } from "./";

@Injectable()
export class DeviceStorageService {

    private _initialized: boolean;

    private watingForInitialization: any[] = [];

    public devices: Device[];

    constructor(public deviceService: DeviceService) {
        this.devices = [];
        this.deviceService.retrieveAll().then((devices: Device[]) => {
            devices.forEach((device) => {
                this.addOrUpdateDevice(device);
            });
            this.watingForInitialization.forEach(promise => {
                promise.resolve();
                this._initialized = true;
            });
        }).catch(error => {
            this.watingForInitialization.forEach(promise => {
                promise.reject(error);
                this._initialized = false;
            });
        });
    }

    public getDevice(id: string) {
        return this.devices.filter((device, index) => {
            return device.id.toString() === id.toString(); // workaround because backend sent id as number ...
        })[0];
    }


    public addOrUpdateDevice(device: Device) {

        let existingDevice = this.getDevice(device.id);

        device.data = device.data.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();  // newest first
        });
        if (!existingDevice) {
            this.devices.push(device);
        } else {
            this.devices[this.devices.indexOf(existingDevice)] = device;
        }
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

    public waitForInitialization(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._initialized) {
                resolve();
            } else {
                this.watingForInitialization.push({ resolve, reject })
            }
        });
    }

}