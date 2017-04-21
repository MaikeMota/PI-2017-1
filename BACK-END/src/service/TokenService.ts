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
        return;
    }

    public static renewToken(userWrapper: UserWrapper, oldToken: string): TokenWrapper {
        let isValid: boolean = TokenService.isValid(new TokenWrapper(oldToken));
        if (isValid) {
            let user: User;
            return TokenService.signToken(userWrapper);
        } else {
            return undefined;
        }
    }

    private static isValid(tokenWrapper: TokenWrapper): boolean {
        jwt.verify(tokenWrapper.token, TokenService.privateKey, {})
        return false;
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