import { Injectable } from '@angular/core';

@Injectable()
export class UserInfoService {
    _token: string;
    private static readonly CLASS_NAME: string = "UserInfoService";

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
        let info: any = JSON.parse(sessionStorage.getItem(UserInfoService.CLASS_NAME));
        this._token = info.token;
    }
}