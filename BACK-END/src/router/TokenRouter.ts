import { Router, Request, Response, NextFunction } from 'express';

import { BaseRouter } from './BaseRouter';

import { TokenService } from '../service/TokenService';
import { TokenWrapper } from '../model/TokenWrapper';
import { AuthenticationWrapper } from "../model/AuthenticationWrapper";
import { UserWrapper } from "../model/UserWrapper";

import { SequelizeInstance } from '../../database/SequelizeInstance';
import { BadRequestException, ForbiddenException } from '../api/rethink/core';
import { StringUtil } from "../api/rethink/util";


export class TokenRouter extends BaseRouter {

    public static readonly AUTHORIZATION_HEADER: string = "authorization";
    public static readonly TOKEN_PREFIX: string = "PI-2017-1";

    protected configureRouter(): void {
        this.router.post('/', TokenRouter.token);
        this.router.post('/renew', TokenRouter.renew); //maybe do a better way to configure new routes
    }

    private static token(request: Request, response: Response, next: NextFunction): void {
        let authenticationWrapper: AuthenticationWrapper = request.body;
        TokenRouter.validateAuthenticationRequest(authenticationWrapper);
        TokenService.authenticate(authenticationWrapper).then((authenticationWrapper: AuthenticationWrapper) => {
            if (authenticationWrapper) {
                response.json({
                    token: authenticationWrapper.token,
                    userInfo: authenticationWrapper.userWrapper
                });
            }
        }).catch(next);
    }

    private static renew(request: Request, response: Response, next: NextFunction): void {
        let authorizationToken: string = request.header(TokenRouter.AUTHORIZATION_HEADER);
        TokenRouter.validateRenewRequest(authorizationToken);
        let token: string = authorizationToken.split(' ')[1];
        TokenService.renewToken(new TokenWrapper(token)).then((renewedTokenWrapper: TokenWrapper) => {
            response.json(renewedTokenWrapper);
        }).catch(next);
    }

    private static validateAuthenticationRequest(authenticationWrapper: AuthenticationWrapper) {
        if (StringUtil.isNullEmptyOrUndefined(authenticationWrapper.username)) {
            throw new BadRequestException("username is required!", -1);
        }
        if (StringUtil.isNullEmptyOrUndefined(authenticationWrapper.password)) {
            throw new BadRequestException("password is required!", -1);
        }
    }

    private static validateRenewRequest(authorizationToken: string): void {
        if (StringUtil.isNullEmptyOrUndefined(authorizationToken)) {
            throw new BadRequestException("Missing Authorization Header", -1);
        }
        let splitedHeaderValue: string[] = authorizationToken.split(' ');
        console.log(splitedHeaderValue[0] !== TokenRouter.TOKEN_PREFIX);
        console.log(StringUtil.isNullEmptyOrUndefined(splitedHeaderValue[1]));
        if (splitedHeaderValue[0] !== TokenRouter.TOKEN_PREFIX && StringUtil.isNullEmptyOrUndefined(splitedHeaderValue[1])) {
            throw new BadRequestException("Invalid Token Header", -1);
        }
    }
}