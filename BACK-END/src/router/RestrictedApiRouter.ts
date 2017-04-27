import { Router, Request, RequestHandler, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';
import { CalculatorRouter } from './CalculatorRouter';

import { RTKException } from '../api/rethink/core';
import { ResponseUtil } from '../api/rethink/util';


export class RestrictedApiRouter extends BaseRouter {

    protected configureRouter(): void {
        this.register('calculator', CalculatorRouter);
    }

    protected configureMiddleware(): void {
        this.router.use((request: Request, response: Response, next: NextFunction) => {
            if (!request.header('authorization')) {
                ResponseUtil.forbidden(response, new RTKException("Missing Token Authorzation", -1));
            } else {
                next();
            }
        });
    }
}