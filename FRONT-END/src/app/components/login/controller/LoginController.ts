import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Controller } from '../../../shared/Controller';
import { Definitions } from '../../../shared/Definitions';
import { User } from '../../../entities/User';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginController extends Controller<User> {

    public static readonly ENDPOINT: string = "token";

    constructor(private http: Http) {
        super();
    }
    
    public login(): void {
        this.http.post(Definitions.SERVER_ADDRESS+"/"+LoginController.ENDPOINT, this.entity).toPromise().then(response => {
            console.log(response);
        }).catch(error => {
            console.error(error);
        });
    }

    clean() {
        this.entity = new User();
    }
}