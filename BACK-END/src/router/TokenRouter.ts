import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';

import { TokenService } from '../service/TokenService';
import { TokenWrapper } from '../model/TokenWrapper';
import { AuthenticationWrapper } from "../model/AuthenticationWrapper";
import { UserWrapper } from "../model/UserWrapper";

import { SequelizeInstance } from '../../database/SequelizeInstance';
import { RTKException } from '../api/rethink/core';


export class TokenRouter extends BaseRouter {

    protected configureRouter(): void {
        this.router.post('/', TokenRouter.token);
        this.router.post('/renew', TokenRouter.renew); //maybe do a better way to configure new routes
    }

    private static token(request: Request, response: Response, next: NextFunction): void {
        let authenticationWrapper: AuthenticationWrapper = request.body;
        if (!authenticationWrapper) {
            response.statusCode = 403;
            response.json(new RTKException("Login Failure", -1));
        }
        SequelizeInstance.UserModel.findOne(
            {
                where: {
                    username: authenticationWrapper.username,
                    password: authenticationWrapper.password,
                    active: true
                }
            }).then((user) => {
                if (user) {
                    let userWrapper: UserWrapper = new UserWrapper(null, user);
                    response.json({
                        token: TokenService.signToken(userWrapper).token,
                        userInfo: userWrapper
                    });
                } else {
                    response.statusCode = 403;
                    response.json(new RTKException("Login Failure", -1));
                }
            });
    }

    private static renew(request: Request, response: Response, next: NextFunction): void {
        let authorizationToken: string = request.header('authorization');
        if (!authorizationToken) {
            response.sendStatus(400);
            return;
        }
        let token: string = authorizationToken.split(' ')[1];
        TokenService.renewToken(new TokenWrapper(token)).then((renewedTokenWrapper: TokenWrapper) => {
            response.json(renewedTokenWrapper);
        }).catch(error => {
            response.statusCode = 403;
            response.json(error);
        });
    }
}