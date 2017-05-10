import { Component, AfterViewInit } from '@angular/core';
import { HomeController } from './controller';
import { DashboardController } from '../dashboard/main/controller';

import 'jquery';

@Component({
	selector: 'home',
	templateUrl: './HomeComponent.html',
	styleUrls: ['./HomeComponent.css']
})
export class HomeComponent implements AfterViewInit {
	title = 'Home';

	constructor(public controller: HomeController, public dashboardController: DashboardController) {
	}

	ngAfterViewInit() {
		jQuery('#modal').modal();
	}

	addDevice() {
		jQuery('#modal').modal('open');
	}
}
