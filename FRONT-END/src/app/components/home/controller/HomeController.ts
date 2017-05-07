import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractController } from '../../../../../../RETHINK/core';
import { UserInfoService } from '../../../services/UserInfoService';

@Injectable()
export class HomeController extends AbstractController<any> {

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