import * as jwt from 'jsonwebtoken';
import { readFileSync } from 'fs'

import { SequelizeInstance } from '../../database/SequelizeInstance';

import { TokenWrapper } from '../model/TokenWrapper';
import { UserWrapper } from '../model/UserWrapper';
import { AuthenticationWrapper } from '../model/AuthenticationWrapper';
import { User } from '../model/User';

import { RTKException } from '../api/rethink/core';

export class TokenService {

    private static defaultOptions: jwt.SignOptions = {
        algorithm: "RS256",
        expiresIn: "7d"
    };

    private static _privateKey;
    private static _publicKey;

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
                            reject(new RTKException("JWT Error: Inavlid Signature", -1));
                        }
                    });
                } else {
                    reject(new RTKException("JWT Error: Inavlid Signature", -1));
                }
            }).catch(error => {
                reject(new RTKException("JWT Error: Inavlid Signature", -1));
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
            }, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });;
        });

    }

    private static get privateKey(): any {
        if (!TokenService._privateKey) {
            TokenService._privateKey = readFileSync('./resources/privateKey.key');
        }
        return TokenService._privateKey;
    }

    private static get publicKey(): any {
        if (!TokenService._publicKey) {
            TokenService._publicKey = readFileSync('./resources/publicKey.pem');
        }
        return TokenService._publicKey;
    }

}