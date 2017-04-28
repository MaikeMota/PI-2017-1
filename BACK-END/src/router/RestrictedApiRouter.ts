import { Router, Request, RequestHandler, Response, NextFunction } from 'express';

import { ForbiddenException } from '../api/rethink/core';
import { ResponseUtil } from '../api/rethink/util';

import { TokenService } from "../service";
import { TokenRouter } from "./TokenRouter";
import { BaseRouter } from './BaseRouter';
import { CalculatorRouter } from './CalculatorRouter';


export class RestrictedApiRouter extends BaseRouter {

    protected configureRouter(): void {
        this.register('calculator', CalculatorRouter);
    }

    protected configureMiddleware(): void {
        this.router.use((request: Request, response: Response, next: NextFunction) => {
            if (!request.header(TokenRouter.AUTHORIZATION_HEADER)) {
                throw new ForbiddenException("Missing Token Authorzation", -1);
            } else {
                next();
            }
        });
    }
}