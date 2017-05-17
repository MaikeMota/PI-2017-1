import { Component, AfterViewInit } from '@angular/core';
import { HomeController } from './controller';
import { DashboardController } from '../dashboard/main/controller';

import 'jquery';
import { SocketService, DeviceService } from "../../services";

@Component({
	selector: 'home',
	templateUrl: './HomeComponent.html',
	styleUrls: ['./HomeComponent.css']
})
export class HomeComponent implements AfterViewInit {
	title = 'Home';

	constructor(public socketService: SocketService, public controller: HomeController, public deviceService: DeviceService,
		private dashboardController: DashboardController) {
		this.deviceService.retrieveAll();
	}

	ngAfterViewInit() {
		jQuery('#modal').modal();
		this.controller.listeningToSocket();
	}

	addDevice() {
		jQuery('#modal').modal('open');
	}
}
