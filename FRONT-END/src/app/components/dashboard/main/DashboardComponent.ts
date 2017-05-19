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

	constructor(private deviceStorageService: DeviceStorageService, public controller: DashboardController) {
		jQuery('#deleteModal').modal();
	}

	public updateDevice(device: Device) {
		this.controller.entity = device.deepClone<Device>();
		jQuery('#modal').modal('open');
	}

	public deleteDevice(device: Device) {
		this.controller.entity = device.deepClone<Device>();
		jQuery('#deleteModal').modal('open');
	}

	public get devices(): Device[] {
		return this.deviceStorageService.devices;
	}
}