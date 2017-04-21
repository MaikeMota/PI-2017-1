import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';

import { TokenService } from '../service/TokenService';
import { TokenWrapper } from '../model/TokenWrapper';
import { AuthenticationWrapper } from "../model/AuthenticationWrapper";
import { UserWrapper } from "../model/UserWrapper";


export class TokenRouter extends BaseRouter {

    protected configureRouter(): void {
        this.router.post('/', TokenRouter.token);
        this.router.post('/renew', TokenRouter.renew); //maybe do a better way to configure new routes
    }

    private static token(request: Request, response: Response, next: NextFunction): void {
        let authenticationWrapper: AuthenticationWrapper = <AuthenticationWrapper>request.body;
        let userWrapper: UserWrapper; //TODO Retrieve from database
        response.json(TokenService.signToken(userWrapper));
    }

    private static renew(request: Request, response: Response, next: NextFunction): void {
        let authorizationToken: string = request.header['Authorization'];
        if (!authorizationToken) {
            response.sendStatus(400);
            return;
        }
        let userWrapper: UserWrapper; //TODO retrieve userWrapper
        let renewTokenWrapper: TokenWrapper = TokenService.renewToken(userWrapper , authorizationToken.split(' ')[1]);
        if (!renewTokenWrapper) {
            response.sendStatus(403); // TODO 
        } else {
            response.json(renewTokenWrapper);
        }
    }
}