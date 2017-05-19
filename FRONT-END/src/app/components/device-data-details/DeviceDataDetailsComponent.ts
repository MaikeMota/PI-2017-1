import { Component } from '@angular/core';
import { DeviceStorageService, EventService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { ObjectUtil } from '../../../../../RETHINK/util';
import { Device, DeviceData } from "../../model/entities";

@Component({
	selector: 'device-data-details',
	templateUrl: './DeviceDataDetailsComponent.html',
	styleUrls: ['./DeviceDataDetailsComponent.css']
})
export class DeviceDataDetailsComponent {

	public device: Device;

	constructor(private deviceStorageService: DeviceStorageService, private eventService: EventService, public route: ActivatedRoute) {
		this.device = null;
		this.route.params.forEach(params => {
			if (ObjectUtil.isPresent(params["id"])) {
				this.deviceStorageService.waitForInitialization().then(() => {
					this.device = this.deviceStorageService.getDevice(params["id"]);
					this.eventService.listenFor(this, `DEVICE/${this.device.id}/DATA_ARRIVED`, (deviceData: DeviceData) => {
						this.device.data.unshift(deviceData);
					});
				}).catch(error => {
					console.log(error);
				});
			}
		});
	}
}
