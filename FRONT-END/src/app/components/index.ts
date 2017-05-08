import { DashboardController } from './dashboard/controller';
import { HomeController } from './home/controller';
import { LoginController } from './login/controller';

import { DashboardComponent } from './dashboard/DashboardComponent';
import { HomeComponent } from './home/HomeComponent';
import { LoginComponent } from './login/LoginComponent';

export const SERVICES: any[] = [
    DashboardController,
    HomeController,
    LoginController
];

export const COMPONENTS: any[] = [
    DashboardComponent,
    HomeComponent,
    LoginComponent
];