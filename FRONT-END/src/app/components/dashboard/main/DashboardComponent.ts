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
	}
}