import * as http from "http";
import * as express from 'express';
import * as socketIO from "socket.io";
import { ObjectUtil } from "../../../RETHINK/util";

export class SocketService {

    private _serverPort = 8080;
    private _app: any;
    private io: SocketIO.Server;
    private static _instance: SocketService;

    public static get instance(): SocketService {
        if (ObjectUtil.isBlank(this._instance)) {
            this._instance = new SocketService();
        }

        return this._instance;
    }

    private constructor() { }

    public enableSocket(httpServer: http.Server): void {
        /*
            var app = express()
            , server = require('http').createServer(app)
            , io = io.listen(server);
            server.listen(80);
        */
        if (ObjectUtil.isBlank(this.io)) {
            this.io = socketIO.listen(httpServer);
            this.registerSocketEvents();
        }
    }

    public broadCast(eventName: string, ...data: any[]): void {
        if (data) {
            for (let d of data) {
                this.io.emit(eventName, d);
            }
        }
    }

    private registerSocketEvents() {
        this.io.on('connect', (socket: SocketIO.Socket) => {
            console.log("New Client with id " + socket.client.id);
            socket.on('disconnect', () => {
                console.log("Client with id " + socket.client.id + " disconnected!");
                this.io.emit("Client with id " + socket.client.id + " disconnected!");
            });
        });

    }
}