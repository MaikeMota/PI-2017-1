export class TokenWrapper {

    constructor(signedToken: string) {
        this.token = signedToken;
    }

    public token: string;
}