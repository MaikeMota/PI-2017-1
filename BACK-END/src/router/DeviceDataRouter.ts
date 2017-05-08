import { Router, Request, RequestHandler, Response, NextFunction } from 'express';

import { ForbiddenException } from '../../../RETHINK/core/exception';
import { StringUtil } from '../../../RETHINK/util';

import { BaseRouter } from './BaseRouter';
import { DeviceDataService } from "../service";


export class DeviceDataRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "device";

    protected configureRouter(): void {
        this.router.post('/:device_key', DeviceDataRouter.receiveData);
    }

    protected configureMiddleware(): void {
    }

    public get PATH(): string {
        return DeviceDataRouter.ROOT_PATH;
    }

    private static receiveData(request: Request, response: Response, next: NextFunction): void {

    }
}