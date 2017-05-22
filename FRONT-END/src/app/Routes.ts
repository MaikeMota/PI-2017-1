import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/LoginComponent';
import { DashboardComponent } from './components/dashboard/main/DashboardComponent';
import { HomeComponent } from './components/home/HomeComponent';
import { DeviceDataDetailsComponent } from './components/device-data-details/DeviceDataDetailsComponent';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'home', component: HomeComponent, children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'data-details/:id', component: DeviceDataDetailsComponent }
        ]
    }
]

export const routes = RouterModule.forRoot(appRoutes);