import { Component } from '@angular/core';
import { Device } from '../../../model/entities/Device';
import { DashboardController } from './controller';

@Component({
	selector: 'dashboard',
	templateUrl: './DashboardComponent.html',
	styleUrls: ['./DashboardComponent.css']
})
export class DashboardComponent {
	title = 'Controle de Cisternas Híbridas';

	constructor(public controller: DashboardController) {
		this.controller.retrieveAll();
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
}