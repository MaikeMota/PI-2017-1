import * as jwt from 'jsonwebtoken';

export class TokenService {

    public static signToken(): string {
        return jwt.sign("Usuário", "SECRET");
    }

    public static renewToken(oldToken: string): string {
        jwt.decode(oldToken);

        //VALIDATE

        return TokenService.signToken();

    }

}