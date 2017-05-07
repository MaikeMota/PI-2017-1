import { DashboardController } from './dashboard/controller';
import { HomeComponent } from './home/HomeComponent';
import { LoginController } from './login/controller';

import { DashboardComponent } from './dashboard/DashboardComponent';
import { LoginComponent } from './login/LoginComponent';

export const SERVICES: any[] = [
    DashboardController,
    LoginController
];

export const COMPONENTS: any[] = [
    DashboardComponent,
    HomeComponent,
    LoginComponent
];