import { COMPONENTS as DASHBOARD_COMPONENTS, SERVICES as DASHBOARD_SERVICES } from './dashboard/definitions';
import { HomeController } from './home/controller';
import { LoginController } from './login/controller';
import { DeviceDetailsController } from './devicedetails/controller';

import { HomeComponent } from './home/HomeComponent';
import { LoginComponent } from './login/LoginComponent';
import { DeviceDetailsComponent } from './devicedetails/DeviceDetailsComponent';

export const SERVICES: any[] = [
    ...DASHBOARD_SERVICES,
    HomeController,
    LoginController,
    DeviceDetailsController
];

export const COMPONENTS: any[] = [
    ...DASHBOARD_COMPONENTS,
    HomeComponent,
    LoginComponent,
    DeviceDetailsComponent
];