import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';
import { Calculator } from '../service/Calculator';
import { SocketService } from '../service/SocketService';


export class DeviceMessageRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "devicemessage";

    protected configureRouter(): void {
        this.router.post('/', DeviceMessageRouter.test);
    }

    public get PATH(): string {
        return DeviceMessageRouter.ROOT_PATH;
    }

    private static test(request: Request, response: Response, next: NextFunction) {
        SocketService.instance.sendMessage(request.body);
        response.json({ result: "Ok"});
    }
}