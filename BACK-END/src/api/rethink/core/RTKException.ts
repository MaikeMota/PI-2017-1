export class RTKException {
    protected _developerMessage: string;
    protected _code: number;

    constructor(developerMessage: string, code: number) {
        this._code = code;
        this._developerMessage = developerMessage;
    }

    public get developerMessage(): string {
        return this._developerMessage;
    }

    public get code(): number {
        return this._code;
    }

    toJson(): any {
        return {
            developerMessage: this.developerMessage,
            code: this.code
        };
    }
}