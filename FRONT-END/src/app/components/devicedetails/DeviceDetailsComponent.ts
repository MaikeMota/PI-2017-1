import { Component } from '@angular/core';
import { DeviceDetailsController } from './controller';
import { SocketService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { ObjectUtil } from '../../../../../RETHINK/util';

@Component({
	selector: 'device-details',
	templateUrl: './DeviceDetailsComponent.html',
	styleUrls: ['./DeviceDetailsComponent.css']
})
export class DeviceDetailsComponent {

	public device_id: number;

	constructor(public controller: DeviceDetailsController, public socketService: SocketService, public route: ActivatedRoute) {
        this.device_id = null;
		this.route.params.forEach(params => {
			if(ObjectUtil.isPresent(params["id"])) {
				this.device_id = Number.parseInt(params["id"]);
			} else {
				this.device_id = null;
			}
        });
	}
}
