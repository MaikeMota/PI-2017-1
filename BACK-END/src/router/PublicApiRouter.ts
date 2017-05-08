import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';

import { TokenRouter } from './TokenRouter';
import { EchoRouter } from './EchoRouter';
import { RestrictedApiRouter } from './RestrictedApiRouter';
import { DeviceDataRouter } from './DeviceDataRouter';

export class PublicApiRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "api";

    protected configureRouter(): void {
        this.register(RestrictedApiRouter);
        this.register(DeviceDataRouter);
        this.register(TokenRouter);
        this.register(EchoRouter);
    }

    public get PATH(): string {
        return PublicApiRouter.ROOT_PATH;
    }
}