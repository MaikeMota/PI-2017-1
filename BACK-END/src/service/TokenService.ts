import * as jwt from 'jsonwebtoken';
import { readFileSync } from 'fs'

import { TokenWrapper } from '../model/TokenWrapper';
import { UserWrapper } from '../model/UserWrapper';
import { AuthenticationWrapper } from '../model/AuthenticationWrapper';
import { User } from '../model/User';

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

    public static renewToken(userWrapper: UserWrapper, oldToken: string): Promise<TokenWrapper> {
        return new Promise<TokenWrapper>((resolve, reject) => {
            TokenService.isValid(new TokenWrapper(oldToken)).then((isValid) => {
                if (isValid) {
                    let user: User;
                    resolve(TokenService.signToken(userWrapper));
                } else {
                    reject();
                }
            });
        });
    }

    private static isValid(tokenWrapper: TokenWrapper): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            jwt.verify(tokenWrapper.token, TokenService.publicKey, {
                algorithms: [this.defaultOptions.algorithm]
            }, (err, decoded) => {
                if (err) {
                    reject();
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