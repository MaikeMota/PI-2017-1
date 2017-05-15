import { Component } from '@angular/core';
import { DeviceDetailsController } from './controller';
import { SocketService } from '../../services';

@Component({
	selector: 'device-details',
	templateUrl: './DeviceDetailsComponent.html',
	styleUrls: ['./DeviceDetailsComponent.css']
})
export class DeviceDetailsComponent {

	constructor(public controller: DeviceDetailsController, private socketService: SocketService) {
        
	}
}
