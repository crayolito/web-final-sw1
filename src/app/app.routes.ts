import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.default),
  },
  {
    path: 'success-stripe',
    loadComponent: () =>
      import('./sucess-stripe/sucess-stripe.component').then((m) => m.default),
  },
  {
    path: 'cancel-stripe',
    loadComponent: () =>
      import('./cancel-stripe/cancel-stripe.component').then((m) => m.default),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.default),
    children: [
      {
        path: 'perfil',
        title: 'Perfil',
        loadComponent: () =>
          import('./dashboard/perfil/perfil.component').then((m) => m.default),
      },
      {
        path: 'informe',
        title: 'Informe',
        loadComponent: () =>
          import('./dashboard/informe/informe.component').then(
            (m) => m.default
          ),
      },
      {
        path: 'extra',
        title: 'Extra',
        loadComponent: () =>
          import('./dashboard/extra/extra.component').then((m) => m.default),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
