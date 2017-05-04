import { Router, Request, RequestHandler, Response, NextFunction } from 'express';

import { ForbiddenException } from '../api/rethink/core/exception';
import { ErrorHandler } from '../api/rethink/service';
import { StringUtil } from '../api/rethink/util';

import { TokenService } from "../service";
import { TokenRouter } from "./TokenRouter";
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
        this.router.use(RestrictedApiRouter.restriectedRouteMiddleware);
    }

    public get PATH(): string {
        return RestrictedApiRouter.ROOT_PATH;
    }

    private static restriectedRouteMiddleware(request: Request, response: Response, next: NextFunction) {
        let header: string = request.header(TokenService.AUTHORIZATION_HEADER);
        TokenService.validateAuthorizationHeader(header);
        let tokenWrapper: TokenWrapper = new TokenWrapper(header.split(' ')[1]);
        TokenService.isValid(tokenWrapper).then(() => {
            TokenService.retrieveUserById(TokenService.decodeToken(tokenWrapper).id).then((user) => {
                next();
            }).catch(error => {
                ErrorHandler.handleError(response, error);
            });
        }).catch(error => {
            ErrorHandler.handleError(response, error);
        });
    }
}