import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Notfound } from './notfound/notfound';
import { AuthGuard } from './services/guard';

export const routes: Routes = [
    { path: '', canActivate: [AuthGuard] ,component: Dashboard },
    { path: 'login', component: Login },
    { path: '**', component: Notfound }
];
