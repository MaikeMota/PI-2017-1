import { Component } from '@angular/core';
import { DeviceStorageService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { ObjectUtil } from '../../../../../RETHINK/util';
import { Device } from "../../model/entities";

@Component({
	selector: 'device-details',
	templateUrl: './DeviceDetailsComponent.html',
	styleUrls: ['./DeviceDetailsComponent.css']
})
export class DeviceDetailsComponent {

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
