import { Routes } from '@angular/router';
import { MainLayoutComponent } from './common/layout/main-layout/main-layout.component';
import { EmptyLayoutComponent } from './common/layout/empty-layout/empty-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./components/home/home-main/home-main.component').then(m => m.HomeMainComponent)
            },
            {
                path: 'map',
                loadComponent: () => import('./components/map/map-main/map-main.component').then(m => m.MapMainComponent)
            }
        ]
    },
    { path: '',
        component: EmptyLayoutComponent,
        children: [
            { 
                path: 'login', 
                loadComponent: () => import('./components/login/login-main/login-main.component').then(m => m.LoginMainComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./components/login/login-register/login-register.component').then(m => m.LoginRegisterComponent)
            }
        ]
    },
];
