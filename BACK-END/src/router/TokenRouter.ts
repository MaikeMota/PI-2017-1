import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';

import { TokenService } from '../service/TokenService';


export class TokenRouter extends BaseRouter {

    protected configureRouter(): void {
        this.router.post('/', TokenRouter.token);
        this.router.post('/renew', TokenRouter.renew); //maybe do a better way to configure new routes
    }

    private static token(request: Request, response: Response, next: NextFunction): void {
        response.json({
            success: true,
            message: 'Enjoy your token!',
            token: TokenService.signToken()
        });
    }

    private static renew(request: Request, response: Response, next: NextFunction): void {
        if (!request.body.token) {
            response.sendStatus(400);
            return;
        }
        response.json({
            success: true,
            message: 'Enjoy your renewed token!',
            token: TokenService.renewToken(request.body.token)
        });
    }
}