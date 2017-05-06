import * as jwt from 'jsonwebtoken';
import { FindOptions } from 'sequelize';

import { readFileSync } from 'fs'

import { SequelizeDataBase } from '../../database/SequelizeDataBase';

import { ForbiddenException, BadRequestException } from '../api/rethink/core/exception';
import { StringUtil } from '../api/rethink/util';

import { UserWrapper } from '../model/UserWrapper';
import { TokenWrapper } from '../model/TokenWrapper';
import { User, UserInstance } from '../model/interface';
import { AuthenticationWrapper } from '../model/AuthenticationWrapper';
import { UserDao } from "../../database/UserDao";
import { UserService } from "./";

export class TokenService {

    public static readonly AUTHORIZATION_HEADER: string = "authorization";
    public static readonly TOKEN_PREFIX: string = "Bearer";

    private static defaultOptions: jwt.SignOptions = {
        algorithm: "RS256",
        expiresIn: "7d"
    };

    private static _privateKey: Buffer;
    private static _publicKey: Buffer;

    public static authenticate(authenticationWrapper: AuthenticationWrapper): Promise<AuthenticationWrapper> {
        return new Promise<AuthenticationWrapper>((resolve, reject) => {
            let instance = UserService.instance();
            instance.byCredentials(authenticationWrapper.username, authenticationWrapper.password).then((user) => {
                authenticationWrapper.userWrapper = new UserWrapper(null, user);
                authenticationWrapper.token = TokenService.signToken(authenticationWrapper.userWrapper).token;
                resolve(authenticationWrapper);
            }).catch(error => {
                reject(error);
            });
        });
    }

    public static signToken(userWrapper: UserWrapper): TokenWrapper {
        let signedToken: string = jwt.sign(userWrapper, TokenService.privateKey, TokenService.defaultOptions);
        let tokenWrapper: TokenWrapper = new TokenWrapper(signedToken);
        return tokenWrapper;
    }

    public static renewToken(tokenWrapper: TokenWrapper): Promise<TokenWrapper> {
        return new Promise<TokenWrapper>((resolve, reject) => {
            TokenService.isValid(tokenWrapper).then((isValid) => {
                if (isValid) {
                    let userId = TokenService.decodeToken(tokenWrapper).id;
                    UserService.instance().byId(userId).then((user) => {
                        tokenWrapper = TokenService.signToken(new UserWrapper(null, user));
                        resolve(tokenWrapper)
                    });
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    public static decodeToken(tokenWrapper: TokenWrapper): UserWrapper {
        let decodedToken = jwt.decode(tokenWrapper.token);
        let userWrapper: UserWrapper = new UserWrapper(null, null);
        userWrapper.id = decodedToken.id;
        userWrapper.username = decodedToken.username;
        // TODO Improve Object Reconstruction
        return userWrapper;
    }

    public static isValid(tokenWrapper: TokenWrapper): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            jwt.verify(tokenWrapper.token, TokenService.publicKey, {
                algorithms: [this.defaultOptions.algorithm]
            }, (err: jwt.JsonWebTokenError | jwt.TokenExpiredError | jwt.NotBeforeError, decoded) => {
                if (!err) {
                    resolve(true);
                } else {
                    reject(new ForbiddenException("JWT: Invalid Token.", -1));
                }
            });;
        });
    }



    public static validateAuthorizationHeader(authorizationToken: string): void {
        if (StringUtil.isNullEmptyOrUndefined(authorizationToken)) {
            throw new ForbiddenException("Missing Authorization Header", -1);
        }
        let splitedHeaderValue: string[] = authorizationToken.split(' ');
        if (splitedHeaderValue[0] !== TokenService.TOKEN_PREFIX && StringUtil.isNullEmptyOrUndefined(splitedHeaderValue[1])) {
            throw new ForbiddenException("Invalid Token Header", -1);
        }
    }

    private static get privateKey(): Buffer {
        if (!TokenService._privateKey) {
            TokenService._privateKey = readFileSync('./resources/privateKey.key');
        }
        return TokenService._privateKey;
    }

    private static get publicKey(): Buffer {
        if (!TokenService._publicKey) {
            TokenService._publicKey = readFileSync('./resources/publicKey.pem');
        }
        return TokenService._publicKey;
    }

}