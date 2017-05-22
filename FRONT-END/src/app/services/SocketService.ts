import { Definitions } from '../shared/Definitions';
import { ObjectUtil } from "../../../../RETHINK/util";
import * as socketIo from 'socket.io-client';
import { Injectable } from '@angular/core';
import { DeviceData } from '../model/entities/DeviceData';
import { DeviceDataEvent } from '../model/entities/DeviceDataEvent';
import { DeviceStorageService, EventService } from "./";

@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;

    constructor(private deviceStorageService: DeviceStorageService, private eventService: EventService) {
        this.init();
    }

    private init(): void {
        this.socket = socketIo(Definitions.SERVER_ADDRESS);
    }

    public startListening(): void {
        let instance: SocketService = this;
        this.socket.on(Definitions.SOCKET_EVENTS.NEW_DATA_EVENT, (data) => {
            let deviceData: DeviceData = new DeviceData();
            deviceData.fill(data);
            deviceData.events = [];
            if (ObjectUtil.isPresent(data.events)) {
                data.events.forEach(dataEvent => {
                    let deviceDataEvent: DeviceDataEvent = new DeviceDataEvent();
                    deviceDataEvent.fill(dataEvent);
                    deviceData.events.push(deviceDataEvent);
                });
            }
            instance.eventService.emit<DeviceData>(`DEVICE/${deviceData.device_id}/DATA_ARRIVED`, deviceData);
        });
    }

    public stopListening(): void {
        this.socket.removeAllListeners();
    }
}