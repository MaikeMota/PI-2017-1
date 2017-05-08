import { Component } from '@angular/core';
import { Device } from '../../model/entities/Device';
import { DeviceDataCrudTests } from '../../../../tests/DeviceDataCrudTests';

@Component({
	selector: 'dashboard',
	templateUrl: './DashboardComponent.html',
	styleUrls: ['./DashboardComponent.css']
})
export class DashboardComponent {
	title = 'Controle de Cisternas Híbridas';

	public devices: Device[];

	constructor(deviceDataCrudTests: DeviceDataCrudTests) {
		this.devices = deviceDataCrudTests.devices;
		console.log(this.devices);
	}
}
