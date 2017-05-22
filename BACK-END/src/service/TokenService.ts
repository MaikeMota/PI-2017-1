import * as jwt from 'jsonwebtoken';
import { FindOptions } from 'sequelize';

import { readFileSync } from 'fs'

import { SequelizeDataBase } from '../../database/SequelizeDataBase';

import { RTKSingleton } from '../../../RETHINK/core';
import { ForbiddenException, BadRequestException } from '../../../RETHINK/core/exception';
import { StringUtil } from '../../../RETHINK/util';

import { UserWrapper } from '../model/UserWrapper';
import { TokenWrapper } from '../model/TokenWrapper';
import { User, UserInstance } from '../model/interface';
import { AuthenticationWrapper } from '../model/AuthenticationWrapper';
import { UserDao } from "../../database/UserDao";
import { UserService } from "./";

export class TokenService extends RTKSingleton {

    /*private static _instance: TokenService;

    public static get instance(): TokenService {
        if (!this._instance) {
            this._instance = new TokenService();
        }
        return this._instance;
    }*/

    public static readonly AUTHORIZATION_HEADER: string = "authorization";
    public static readonly TOKEN_PREFIX: string = "Bearer";

    private defaultOptions: jwt.SignOptions = {
        algorithm: "RS256",
        expiresIn: "7d"
    };

    private _privateKey: Buffer;
    private _publicKey: Buffer;

    public authenticate(authenticationWrapper: AuthenticationWrapper): Promise<AuthenticationWrapper> {
        return new Promise<AuthenticationWrapper>((resolve, reject) => {
            let instance = UserService.instance();
            instance.byCredentials(authenticationWrapper.username, authenticationWrapper.password).then((user) => {
                authenticationWrapper.userWrapper = new UserWrapper(null, user);
                authenticationWrapper.token = this.signToken(authenticationWrapper.userWrapper).token;
                resolve(authenticationWrapper);
            }).catch(error => {
                reject(error);
            });
        });
    }

    public signToken(userWrapper: UserWrapper): TokenWrapper {
        let signedToken: string = jwt.sign(userWrapper, this.privateKey, this.defaultOptions);
        let tokenWrapper: TokenWrapper = new TokenWrapper(signedToken);
        return tokenWrapper;
    }

    public renewToken(tokenWrapper: TokenWrapper): Promise<TokenWrapper> {
        return new Promise<TokenWrapper>((resolve, reject) => {
            this.isValid(tokenWrapper).then((isValid) => {
                if (isValid) {
                    let userId = this.decodeToken(tokenWrapper).id;
                    UserService.instance().byId(userId).then((user) => {
                        tokenWrapper = this.signToken(new UserWrapper(null, user));
                        resolve(tokenWrapper)
                    });
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    public decodeToken(tokenWrapper: TokenWrapper): UserWrapper {
        let decodedToken = jwt.decode(tokenWrapper.token);
        let userWrapper: UserWrapper = new UserWrapper(null, null);
        userWrapper.id = decodedToken.id;
        userWrapper.username = decodedToken.username;
        // TODO Improve Object Reconstruction
        return userWrapper;
    }

    public isValid(tokenWrapper: TokenWrapper): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            jwt.verify(tokenWrapper.token, this.publicKey, {
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



    public validateAuthorizationHeader(authorizationToken: string): void {
        if (StringUtil.isNullEmptyOrUndefined(authorizationToken)) {
            throw new ForbiddenException("Missing Authorization Header", -1);
        }
        let splitedHeaderValue: string[] = authorizationToken.split(' ');
        if (splitedHeaderValue[0] !== TokenService.TOKEN_PREFIX && StringUtil.isNullEmptyOrUndefined(splitedHeaderValue[1])) {
            throw new ForbiddenException("Invalid Token Header", -1);
        }
    }

    private get privateKey(): Buffer {
        if (!this._privateKey) {
            this._privateKey = readFileSync('./resources/privateKey.key');
        }
        return this._privateKey;
    }

    private get publicKey(): Buffer {
        if (!this._publicKey) {
            this._publicKey = readFileSync('./resources/publicKey.pem');
        }
        return this._publicKey;
    }

}