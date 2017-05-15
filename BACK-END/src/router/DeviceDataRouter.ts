import { Router, Request, RequestHandler, Response, NextFunction } from 'express';

import { ForbiddenException } from '../../../RETHINK/core/exception';
import { StringUtil } from '../../../RETHINK/util';

import { BaseRouter } from './BaseRouter';
import { DeviceDataService, DeviceService } from "../service";
import { DeviceDataWrapper } from "../model/DeviceDataWrapper";
import { SocketService } from "../service/SocketService";
import { Device } from "../model/interface/index";


export class DeviceDataRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "device";
    public static readonly DEVICE_KEY_PARAM = "device_key";
    public static readonly NEW_DATA_EVENT: string = "NEW_DEVICE_DATA";

    protected configureRouter(): void {
        this.router.post('/data/:device_key', DeviceDataRouter.receiveData);
        this.router.get('/config/:device_key', DeviceDataRouter.retrieveDeviceConfig);
    }

    protected configureMiddleware(): void {
    }

    public get PATH(): string {
        return DeviceDataRouter.ROOT_PATH;
    }

    private static receiveData(request: Request, response: Response, next: NextFunction): void {
        let deviceDataWrapper: DeviceDataWrapper = new DeviceDataWrapper(request.param(DeviceDataRouter.DEVICE_KEY_PARAM), request.body);
        DeviceDataService.instance<DeviceDataService>().save(deviceDataWrapper).then((deviceData) => {
            console.log('[DATA] - ' + JSON.stringify(deviceData));
            SocketService.instance<SocketService>().broadCast(DeviceDataRouter.NEW_DATA_EVENT, deviceData);
            response.json();
        }).catch(next);
    }

    private static retrieveDeviceConfig(request: Request, response: Response, next: NextFunction): void {
        let device_key = request.param(DeviceDataRouter.DEVICE_KEY_PARAM);
        DeviceService.instance<DeviceService>().deviceConfig(device_key).then((config) => {
            response.contentType('application/text');
            response.send(config);
        }).catch(next);
    }
}