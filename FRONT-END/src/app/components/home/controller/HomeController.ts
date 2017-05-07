import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Controller } from '../../../shared/Controller';
import { UserInfoService } from '../../../services/UserInfoService';

@Injectable()
export class HomeController extends Controller<any> {

    constructor(private userInfoService: UserInfoService, private router: Router) {
        super();
    }

    clean() {

    }

    public logout() {
        this.userInfoService.token = undefined;
        this.router.navigate(["login"]);
    }
}