import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';

import { TokenRouter } from './TokenRouter';
import { RestrictedApiRouter } from './RestrictedApiRouter';

export class PublicApiRouter extends BaseRouter {

    protected configureRouter(): void {
        this.register('token', TokenRouter);
        this.register('restricted', RestrictedApiRouter);
    }
}