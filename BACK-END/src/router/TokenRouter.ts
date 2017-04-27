import { Router, Request, Response, NextFunction } from 'express';
import { BaseRouter } from './BaseRouter';

import { TokenService } from '../service/TokenService';
import { TokenWrapper } from '../model/TokenWrapper';
import { AuthenticationWrapper } from "../model/AuthenticationWrapper";
import { UserWrapper } from "../model/UserWrapper";

import { SequelizeInstance } from '../../database/SequelizeInstance';
import { RTKException } from '../api/rethink/core';
import { ResponseUtil } from '../api/rethink/util';


export class TokenRouter extends BaseRouter {

    protected configureRouter(): void {
        this.router.post('/', TokenRouter.token);
        this.router.post('/renew', TokenRouter.renew); //maybe do a better way to configure new routes
    }

    private static token(request: Request, response: Response, next: NextFunction): void {
        let authenticationWrapper: AuthenticationWrapper = request.body;
        if (!authenticationWrapper) {
            ResponseUtil.forbidden(response, new RTKException("Login Failure", -1));
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
                    ResponseUtil.forbidden(response, new RTKException("Login Failure", -1));
                }
            });
    }

    private static renew(request: Request, response: Response, next: NextFunction): void {
        let authorizationToken: string = request.header('authorization');
        if (!authorizationToken) {
            response.statusCode = 400;
            response.json(new RTKException("Missing Authorization Header", -1));
            return;
        }
        let token: string = authorizationToken.split(' ')[1];
        TokenService.renewToken(new TokenWrapper(token)).then((renewedTokenWrapper: TokenWrapper) => {
            response.json(renewedTokenWrapper);
        }).catch(error => {
            ResponseUtil.forbidden(response, error);
        });
    }
}