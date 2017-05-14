import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/LoginComponent';
import { DashboardComponent } from './components/dashboard/main/DashboardComponent';
import { HomeComponent } from './components/home/HomeComponent';
import { DeviceDetailsComponent } from './components/devicedetails/DeviceDetailsComponent';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'home', component: HomeComponent, children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'details/:id', component: DeviceDetailsComponent }
        ]
    }
]

export const routes = RouterModule.forRoot(appRoutes);