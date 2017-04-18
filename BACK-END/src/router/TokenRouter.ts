import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';


export class TokenRouter extends BaseRouter {

    protected configureRouter(): void {
        this.router.post('/', TokenRouter.token);
        this.router.post('/renew', TokenRouter.renew); //maybe do a better way to configure new routes
    }

    private static token(request: Request, response: Response, next: NextFunction): void {
        response.json({ result: "generated token" });
    }

    private static renew(request: Request, response: Response, next: NextFunction): void {
        // extract authorization token header to validate renew
        response.json({ result: "renewed token" });
    }
}