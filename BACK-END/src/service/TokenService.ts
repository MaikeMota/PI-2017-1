import * as jwt from 'jsonwebtoken';
import * as fs from 'fs'

import { User } from '../model/User';

export class TokenService {

    private static _privateKey;

    private static get privateKey(): any {
        if (!TokenService._privateKey) {
            TokenService._privateKey = fs.readFileSync('./resources/privateKey.key');
        }
        return TokenService._privateKey;
    }
    private static _publicKey;

    private static get publicKey(): any {
        if (!TokenService._publicKey) {
            TokenService._publicKey = fs.readFileSync('./resources/publicKey.pem');
        }
        return TokenService._publicKey;
    }

    public static signToken(): string {
        return jwt.sign('Usuário', TokenService.privateKey, { algorithm: 'RS256' });
    }

    public static renewToken(oldToken: string): string {
        //VALIDATE
        return TokenService.signToken();

    }

}