import { DashboardComponent } from './main/DashboardComponent';
import { ModalComponent } from './modal/ModalComponent';
import { DashboardController } from './main/controller';
import { DeviceCardComponent } from "./main/device-card/DeviceCardComponent";

export const COMPONENTS: any[] = [
    ModalComponent,
    DashboardComponent,
    DeviceCardComponent
];

export const SERVICES: any[] = [
    DashboardController
];