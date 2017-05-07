import { Component } from '@angular/core';
import { HomeController } from './controller';

@Component({
	selector: 'home',
	templateUrl: './HomeComponent.html',
	styleUrls: ['./HomeComponent.css']
})
export class HomeComponent {
	title = 'Home';

    constructor(public controller: HomeController) {

    }
}
