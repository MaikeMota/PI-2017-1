import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Device } from '../../../model/entities/Device';
import { WaterInLetOpenTrigger } from '../../../model/enum/WaterInLetOpenTrigger';
import { WaterInLetCloseTrigger } from '../../../model/enum/WaterInLetCloseTrigger';
import { DashboardController } from '../main/controller';

@Component({
	selector: 'modal',
	templateUrl: './ModalComponent.html',
	styleUrls: ['./ModalComponent.css']
})
export class ModalComponent {

	public get inletOpenTriggers(): WaterInLetOpenTrigger[] {
		return WaterInLetOpenTrigger.values();
	}

	public get inletCloseTriggers(): WaterInLetCloseTrigger[] {
		return WaterInLetCloseTrigger.values();
	}

	constructor(public controller: DashboardController) {
        
	}
}
