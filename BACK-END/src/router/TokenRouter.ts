import { Router, Request, Response, NextFunction } from 'express';

import { BaseRouter } from './BaseRouter';

import { TokenService } from '../service/TokenService';
import { TokenWrapper } from '../model/TokenWrapper';
import { AuthenticationWrapper } from "../model/AuthenticationWrapper";
import { UserWrapper } from "../model/UserWrapper";

import { BadRequestException, ForbiddenException } from '../../../RETHINK/core/exception';
import { StringUtil } from "../../../RETHINK/util";


export class TokenRouter extends BaseRouter {

    public static readonly ROOT_PATH: string = "token";

    protected configureRouter(): void {
        this.router.post('/', TokenRouter.token);
        this.router.post('/renew', TokenRouter.renew); //maybe do a better way to configure new routes
    }

    public get PATH(): string {
        return TokenRouter.ROOT_PATH;
    }

    private static token(request: Request, response: Response, next: NextFunction): void {
        let authenticationWrapper: AuthenticationWrapper = request.body;
        TokenRouter.validateAuthenticationRequest(authenticationWrapper);
        TokenService.instance.authenticate(authenticationWrapper).then((authenticationWrapper: AuthenticationWrapper) => {
            if (authenticationWrapper) {
                response.json({
                    token: authenticationWrapper.token,
                    userInfo: authenticationWrapper.userWrapper
                });
            }
        }).catch(next);
    }

    private static renew(request: Request, response: Response, next: NextFunction): void {
        let authorizationToken: string = request.header(TokenService.AUTHORIZATION_HEADER);
        TokenService.instance.validateAuthorizationHeader(authorizationToken);
        let token: string = authorizationToken.split(' ')[1];
        TokenService.instance.renewToken(new TokenWrapper(token)).then((renewedTokenWrapper: TokenWrapper) => {
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
}