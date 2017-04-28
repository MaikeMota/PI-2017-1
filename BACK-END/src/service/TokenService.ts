import * as jwt from 'jsonwebtoken';
import { readFileSync } from 'fs'

import { SequelizeInstance } from '../../database/SequelizeInstance';

import { ForbiddenException } from '../api/rethink/core';

import { User } from '../model/User';
import { UserWrapper } from '../model/UserWrapper';
import { TokenWrapper } from '../model/TokenWrapper';
import { AuthenticationWrapper } from '../model/AuthenticationWrapper';

export class TokenService {

    private static defaultOptions: jwt.SignOptions = {
        algorithm: "RS256",
        expiresIn: "7d"
    };

    private static _privateKey: Buffer;
    private static _publicKey: Buffer;

    public static authenticate(authenticationWrapper: AuthenticationWrapper): Promise<AuthenticationWrapper> {
        return new Promise<AuthenticationWrapper>((resolve, reject) => {
            SequelizeInstance.UserModel.findOne(
                {
                    where: {
                        username: authenticationWrapper.username,
                        password: authenticationWrapper.password,
                        active: true
                    }
                }).then((dbUser) => {
                    if (dbUser) {
                        authenticationWrapper.userWrapper = new UserWrapper(null, dbUser);
                        authenticationWrapper.token = TokenService.signToken(authenticationWrapper.userWrapper).token;
                        resolve(authenticationWrapper);
                    } else {
                        throw new ForbiddenException("Login Failure", -1);
                    }
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
                    let userId = TokenService.decodeToken(tokenWrapper.token).id;
                    SequelizeInstance.UserModel.findById(userId, {
                        where: {
                            active: true
                        }
                    }).then((dbUser) => {
                        if (dbUser) {
                            resolve(TokenService.signToken(new UserWrapper(null, dbUser)));
                        } else {
                            throw new ForbiddenException("Login Failure", -1);
                        }
                    }).catch(error => {
                        reject(error);
                    });
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    public static decodeToken(token: string): UserWrapper {
        let decodedToken = jwt.decode(token);
        let userWrapper: UserWrapper = new UserWrapper(null, null);
        userWrapper.id = decodedToken.id;
        userWrapper.username = decodedToken.username;
        // TODO Improve Object Reconstruction
        return userWrapper;
    }

    private static isValid(tokenWrapper: TokenWrapper): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            jwt.verify(tokenWrapper.token, TokenService.publicKey, {
                algorithms: [this.defaultOptions.algorithm]
            }, (err: jwt.JsonWebTokenError | jwt.TokenExpiredError | jwt.NotBeforeError, decoded) => {
                if (!err) {
                    resolve(true);
                } else {
                    throw new ForbiddenException("JWT: Invalid Token.", -1);
                }
            });;
        });

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