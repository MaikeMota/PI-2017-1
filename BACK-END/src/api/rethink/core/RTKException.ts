export class RTKException {
    protected _developerMessage: string;
    protected _code: number;
    protected _statusCode: number;

    constructor(developerMessage: string, code: number, statusCode: number) {
        this._code = code;
        this._statusCode = statusCode;
        this._developerMessage = developerMessage;
    }

    public get developerMessage(): string {
        return this._developerMessage;
    }

    public get code(): number {
        return this._code;
    }

    toJSON(): any {
        return {
            developerMessage: this.developerMessage,
            code: this.code
        };
    }
}