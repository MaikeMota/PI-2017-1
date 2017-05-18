import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '../../../model/entities/Device';
import { DashboardController } from './controller';
import { DeviceStorageService } from "../../../services";

@Component({
	selector: 'dashboard',
	templateUrl: './DashboardComponent.html',
	styleUrls: ['./DashboardComponent.css']
})
export class DashboardComponent {
	title = 'Controle de Cisternas Híbridas';

	constructor(private deviceStorageService: DeviceStorageService, public controller: DashboardController, private router: Router) {
		jQuery('#deleteModal').modal();
	}

	public update(device: Device) {
		this.controller.entity = device.deepClone<Device>();
		jQuery('#modal').modal('open');
	}

	public delete(device: Device) {
		this.controller.entity = device.deepClone<Device>();
		jQuery('#deleteModal').modal('open');
	}

	public navigateToDetails(device: Device) {
		this.router.navigate(['home', 'details', device.id]);
	}

	public get devices(): Device[] {
		return this.deviceStorageService.devices;
	}
}