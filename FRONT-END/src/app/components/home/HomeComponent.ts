import { Component, AfterViewInit } from '@angular/core';
import { HomeController } from './controller';
import { DashboardController } from '../dashboard/main/controller';

import 'jquery';
import { SocketService, DeviceService, DeviceStorageService } from "../../services";
import { Device } from "../../model/entities";

@Component({
	selector: 'home',
	templateUrl: './HomeComponent.html',
	styleUrls: ['./HomeComponent.css']
})
export class HomeComponent implements AfterViewInit {
	title = 'Home';

	constructor(public socketService: SocketService, public controller: HomeController, private dashboardController: DashboardController, private deviceStorageService: DeviceStorageService) {
	}

	ngAfterViewInit() {
		jQuery('#modal').modal();
		this.deviceStorageService.waitForInitialization().then(() => {
			this.controller.listeningToSocket();
		}).catch(error => {
			console.log(error);
		});
	}

	addDevice() {
		this.dashboardController.entity = new Device();
		jQuery('#modal').modal('open');
	}
}
