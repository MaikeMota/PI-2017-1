import { Injectable } from '@angular/core';
import { StringUtil } from '../../../../RETHINK/util';

@Injectable()
export class UserInfoService {
    _token: string;
    private static readonly CLASS_NAME: string = "UserInfoService";

    constructor() {
        this.recover();
    }

    public get token(): string {
        return this._token;
    }

    public set token(token: string) {
        this._token = token;
        this.save();
    }

    public save(): void {
        let info: string = JSON.stringify(this);
        sessionStorage.setItem(UserInfoService.CLASS_NAME, info);
    }

    public recover(): void {
        let token: string = sessionStorage.getItem(UserInfoService.CLASS_NAME);

        if(StringUtil.isNullEmptyOrUndefined(token)) {
            return;
        }

        let info: UserInfoService = JSON.parse(token);
        this._token = info._token;
    }
}