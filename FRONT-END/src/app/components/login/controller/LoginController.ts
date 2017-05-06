import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Controller } from '../../../shared/Controller';
import { Definitions } from '../../../shared/Definitions';
import { User } from '../../../entities/User';
import { UserInfoService } from '../../../services/UserInfoService';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginController extends Controller<User> {

    public static readonly ENDPOINT: string = "token";

    constructor(private http: Http, private router: Router, private userInfoService: UserInfoService) {
        super();
    }
    
    public login(): void {
        this.http.post(Definitions.SERVER_ADDRESS+"/"+LoginController.ENDPOINT, this.entity).toPromise().then(response => {
            this.userInfoService.token = response.json().token;
            this.router.navigate(['dashboard']);
        }).catch(error => {
            console.error(error);
        });
    }

    clean() {
        this.entity = new User();
    }
}