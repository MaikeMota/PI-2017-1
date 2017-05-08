import { Router, Request, RequestHandler, Response, NextFunction } from 'express';

import { ForbiddenException } from '../../../RETHINK/core/exception';
import { StringUtil } from '../../../RETHINK/util';

import { BaseRouter } from './BaseRouter';
import { DeviceDataService } from "../service";
import { DeviceDataWrapper } from "../model/DeviceDataWrapper";


export class DeviceDataRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "device";
    public static readonly DEVICE_KEY_PARAM = "device_key"

    protected configureRouter(): void {
        this.router.post('/device/data/:device_key', DeviceDataRouter.receiveData);
        this.router.get('/device/config/:deice_key', DeviceDataRouter.retrieveDeviceConfig);
    }

    protected configureMiddleware(): void {
    }

    public get PATH(): string {
        return DeviceDataRouter.ROOT_PATH;
    }

    private static receiveData(request: Request, response: Response, next: NextFunction): void {
        let deviceDataWrapper: DeviceDataWrapper = request.body;
        deviceDataWrapper.device_key = request.param(DeviceDataRouter.DEVICE_KEY_PARAM);
        DeviceDataService.instance().save(deviceDataWrapper).then(() => {
            response.json();
        }).catch(next);
    }

    private static retrieveDeviceConfig(request: Request, response: Response, next: NextFunction): void {
        next();
    }
}