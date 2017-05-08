import { Component } from '@angular/core';

@Component({
	selector: 'dashboard',
	templateUrl: './DashboardComponent.html',
	styleUrls: ['./DashboardComponent.css']
})
export class DashboardComponent {
	title = 'Controle de Cisternas Híbridas';

	public devices = [{
		description: "This is the first device of the array to test the interface with a very large number of elements."
	}, {
		description: "This is the second device of the array to test the interface with a very large number of elements."
	}, {
		description: "This is the third device of the array to test the interface with a very large number of elements."
	}, {
		description: "This is the fourth device of the array to test the interface with a very large number of elements."
	}];
}
