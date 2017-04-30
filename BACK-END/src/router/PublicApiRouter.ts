import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';

import { TokenRouter } from './TokenRouter';
import { EchoRouter } from './EchoRouter';
import { RestrictedApiRouter } from './RestrictedApiRouter';

export class PublicApiRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "api";

    protected configureRouter(): void {
        this.register(TokenRouter);
        this.register(EchoRouter);
        this.register(RestrictedApiRouter);
    }

    public get PATH(): string {
        return PublicApiRouter.ROOT_PATH;
    }
}