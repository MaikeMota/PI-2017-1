import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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

    @ViewChild(NgForm)
    public form: NgForm;

	public get inletOpenTriggers(): WaterInLetOpenTrigger[] {
		return WaterInLetOpenTrigger.values();
	}

	public get inletCloseTriggers(): WaterInLetCloseTrigger[] {
		return WaterInLetCloseTrigger.values();
	}

	constructor(public controller: DashboardController) {
        
	}
}
