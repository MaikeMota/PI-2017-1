import { Router, Request, RequestHandler, Response, NextFunction } from 'express';

import { ForbiddenException } from '../api/rethink/core';
import { ResponseUtil } from '../api/rethink/util';

import { TokenService } from "../service";
import { TokenRouter } from "./TokenRouter";
import { BaseRouter } from './BaseRouter';
import { CalculatorRouter } from './CalculatorRouter';
import { TokenWrapper } from '../model/TokenWrapper';


export class RestrictedApiRouter extends BaseRouter {

    protected configureRouter(): void {
        this.register('calculator', CalculatorRouter);
    }

    protected configureMiddleware(): void {
        this.router.use((request: Request, response: Response, next: NextFunction) => {
            let header: string = request.header(TokenRouter.AUTHORIZATION_HEADER);
            if (!header) {
                throw new ForbiddenException("Missing Token Authorzation", -1);
            } else {
                let token: string = header.replace("Bearer ", "");
                if (TokenService.isValid(new TokenWrapper(token))) {
                    next();
                } else {
                    throw new ForbiddenException("Invalid Token", -1);
                }
            }
        });
    }
}