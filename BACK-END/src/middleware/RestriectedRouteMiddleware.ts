import { Router, Request, RequestHandler, Response, NextFunction } from 'express';
import { TokenService, UserService } from "../service";
import { TokenWrapper } from '../model/TokenWrapper';
import { ErrorHandler } from '../api/rethink/service';

export function validateJWTAuthentication(request: Request, response: Response, next: NextFunction) {
    let header: string = request.header(TokenService.AUTHORIZATION_HEADER);
    TokenService.instance.validateAuthorizationHeader(header);
    let tokenWrapper: TokenWrapper = new TokenWrapper(header.split(' ')[1]);
    TokenService.instance.isValid(tokenWrapper).then(() => {
        UserService.instance().byId(TokenService.instance.decodeToken(tokenWrapper).id).then((user) => {
            next();
        }).catch(error => {
            ErrorHandler.handleError(response, error);
        });
    }).catch(error => {
        ErrorHandler.handleError(response, error);
    });
}