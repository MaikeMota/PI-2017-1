import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/LoginComponent';
import { DashboardComponent } from './components/dashboard/DashboardComponent';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent }
]

export const routes = RouterModule.forRoot(appRoutes);