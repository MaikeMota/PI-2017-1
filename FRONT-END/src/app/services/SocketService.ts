import { Definitions } from '../shared/Definitions';
import { ObjectUtil } from "../../../../RETHINK/util";
import * as socketIo from 'socket.io-client';
import { Injectable } from '@angular/core';

@Injectable()
export class SocketService {
    public static readonly NEW_DATA_EVENT: string = "NEW_DEVICE_DATA";
    private socket: SocketIOClient.Socket;

    constructor() {
        this.init();
        this.startListening();
        console.log("Constructed");
    }

    private init(): void {
        this.socket = socketIo(Definitions.SERVER_ADDRESS);
    }

    protected startListening(): void {
        this.socket.on(SocketService.NEW_DATA_EVENT, (data) => {
            console.log(data);
        });
    }
}