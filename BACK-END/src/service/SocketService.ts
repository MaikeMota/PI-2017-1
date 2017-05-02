import * as http from "http";
import * as socketIo from "socket.io";
import { ObjectUtil } from '../api/rethink/util';
import { RTKException } from '../api/rethink/core/exception';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

export class SocketService {

    private readonly EVENT_NAME = "device_message" ;
    private _serverPort = 8080;
    private _app: any;
    private io: SocketIO.Server;
    private server: http.Server;
    private static _instance: SocketService;

    public static get instance(): SocketService {
        if (ObjectUtil.isBlank(this._instance)) {
            this._instance = new SocketService();
        }

        return this._instance;
    }

    private constructor() {}

    public sendMessage(message: any) {
        this.io.emit(this.EVENT_NAME, message);
    }

    public app(app: any): SocketService {
        this._app = app;
        if (ObjectUtil.isBlank(this.server)) {
            this.server = http.createServer(this.app);
        } else {
            this.server.removeAllListeners();
            this.server = http.createServer(this.app);
        }
        this.io = socketIo(this.server);
        return this;
    }

    public serverPort(port: number): SocketService {
        this._serverPort = port;
        console.log("port: ", port);
        return this;
    }

    public listen() {
        this.server.listen(this._serverPort, () => {
            console.log('Running server on port %s', this._serverPort);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this._serverPort);
            socket.on(this.EVENT_NAME, (deviceMessage: any) => {
                console.log('[server](message): %s', JSON.stringify(deviceMessage));
                this.io.emit(this.EVENT_NAME, deviceMessage);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}