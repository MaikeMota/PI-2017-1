import { Router, Request, RequestHandler, Response, NextFunction } from 'express';

import { validateJWTAuthentication } from '../middleware/RestriectedRouteMiddleware';

import { ForbiddenException } from '../api/rethink/core/exception';
import { StringUtil } from '../api/rethink/util';

import { TokenService, UserService } from "../service";
import { BaseRouter } from './BaseRouter';
import { CalculatorRouter } from './CalculatorRouter';
import { DeviceRouter } from './DeviceRouter';
import { TokenWrapper } from '../model/TokenWrapper';


export class RestrictedApiRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "restricted";

    protected configureRouter(): void {
        this.register(CalculatorRouter);
        this.register(DeviceRouter);
    }

    protected configureMiddleware(): void {
        this.router.use(validateJWTAuthentication);
    }

    public get PATH(): string {
        return RestrictedApiRouter.ROOT_PATH;
    }
}