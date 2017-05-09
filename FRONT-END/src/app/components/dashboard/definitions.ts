import { DashboardComponent } from './main/DashboardComponent';
import { ModalComponent } from './modal/ModalComponent';
import { DashboardController } from './main/controller';
import { ModalController } from './modal/controller';

export const COMPONENTS: any[] = [
    DashboardComponent,
    ModalComponent
];

export const SERVICES: any[] = [
    DashboardController,
    ModalController
];