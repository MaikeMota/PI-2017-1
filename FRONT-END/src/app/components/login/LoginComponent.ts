import { Component } from '@angular/core';
import { LoginController } from './controller';

@Component({
    selector: 'login',
    templateUrl: './LoginComponent.html',
    styleUrls: ['./LoginComponent.css']
})
export class LoginComponent {

    public showErrorMessage: boolean;
    
    constructor(public controller: LoginController) {

    }

    public dismissErrorMessage(): void {
        this.showErrorMessage = false;
    }
}