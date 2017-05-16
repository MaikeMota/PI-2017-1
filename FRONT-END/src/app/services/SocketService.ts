import { Definitions } from '../shared/Definitions';
import { ObjectUtil } from "../../../../RETHINK/util";
import * as socketIo from 'socket.io-client';
import { Injectable } from '@angular/core';
import { DeviceData } from '../model/entities/DeviceData';
import { DeviceDataEvent } from '../model/entities/DeviceDataEvent';

@Injectable()
export class SocketService {
    public static readonly NEW_DATA_EVENT: string = "NEW_DEVICE_DATA";
    private socket: SocketIOClient.Socket;
    public deviceDatas: Map<string, DeviceData>;

    constructor() {
        this.init();
        this.deviceDatas = new Map<string, DeviceData>();
    }

    private init(): void {
        this.socket = socketIo(Definitions.SERVER_ADDRESS);
    }

    public startListening(): void {
        let instance: SocketService = this;
        this.socket.on(SocketService.NEW_DATA_EVENT, (data) => {
            let deviceData: DeviceData = new DeviceData();
            deviceData.fill(data);
            deviceData.events = [];
            if(ObjectUtil.isPresent(data.events)) {
                data.events.forEach(dataEvent => {
                    let deviceDataEvent: DeviceDataEvent = new DeviceDataEvent();
                    deviceDataEvent.fill(dataEvent);
                    deviceData.events.push(deviceDataEvent);
                });
            }
            
            instance.deviceDatas.set(deviceData.device_id, deviceData);
            console.log(instance.deviceDatas);
        });
    }

    public getDeviceData(device_id: string): DeviceData {
        return this.deviceDatas.get(device_id);
    }
}