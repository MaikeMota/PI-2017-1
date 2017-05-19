import { Component } from '@angular/core';
import { DeviceStorageService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { ObjectUtil } from '../../../../../RETHINK/util';
import { Device } from "../../model/entities";

@Component({
	selector: 'device-data-details',
	templateUrl: './DeviceDataDetailsComponent.html',
	styleUrls: ['./DeviceDataDetailsComponent.css']
})
export class DeviceDataDetailsComponent {

	public device: Device;

	constructor(private deviceStorageService: DeviceStorageService, public route: ActivatedRoute) {
		this.device = null;
		this.route.params.forEach(params => {
			if (ObjectUtil.isPresent(params["id"])) {
				this.deviceStorageService.waitForInitialization().then(() => {
					this.device = this.deviceStorageService.getDevice(params["id"]);
				}).catch(error => {
					console.log(error);
				});
			}
		});
	}
}
