import { Routes } from '@angular/router';
import { MainLayoutComponent } from './common/layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./components/home/home-main/home-main.component').then(m => m.HomeMainComponent)
            }
            ]
    },
];
