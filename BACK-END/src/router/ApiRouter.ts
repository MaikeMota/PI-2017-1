import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';

import { TokenRouter } from './TokenRouter';


export class ApiRouter extends BaseRouter {

    protected configureRouter(): void {
        this.register('token', TokenRouter);
    }
}