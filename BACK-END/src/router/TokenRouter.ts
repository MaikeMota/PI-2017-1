import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';

import { TokenService } from '../service/TokenService';
import { TokenWrapper } from '../model/TokenWrapper';
import { AuthenticationWrapper } from "../model/AuthenticationWrapper";
import { UserWrapper } from "../model/UserWrapper";

import { SequelizeInstance } from '../../database/SequelizeInstance';


export class TokenRouter extends BaseRouter {

    protected configureRouter(): void {
        this.router.post('/', TokenRouter.token);
        this.router.post('/renew', TokenRouter.renew); //maybe do a better way to configure new routes
    }

    private static token(request: Request, response: Response, next: NextFunction): void {
        let authenticationWrapper: AuthenticationWrapper = <AuthenticationWrapper>request.body;
        SequelizeInstance.UserModel.findOne({ where: { username: authenticationWrapper.username } }).then((user) => {
            if(user && authenticationWrapper && user.password === authenticationWrapper.password) {
                let userWrapper: UserWrapper = new UserWrapper(null, user);
                response.json({
                    token: TokenService.signToken(userWrapper).token,
                    userId: userWrapper.id
                });
            } else {
                response.statusCode = 403;
                response.json({
                    developerMessage: "Login Failure",
                    statusCode: 1
                });
            }
        });
    }

    private static renew(request: Request, response: Response, next: NextFunction): void {
        let authorizationToken: string = request.header['Authorization'];
        if (!authorizationToken) {
            response.sendStatus(400);
            return;
        }
        let userWrapper: UserWrapper; //TODO retrieve userWrapper
        let renewTokenWrapper: TokenWrapper = TokenService.renewToken(userWrapper, authorizationToken.split(' ')[1]);
        if (!renewTokenWrapper) {
            response.sendStatus(403); // TODO 
        } else {
            response.json(renewTokenWrapper);
        }
    }
}