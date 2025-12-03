import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'topics/:id',
    loadComponent: () =>
      import('./features/topics/pages/topic-detail/topic-detail').then((m) => m.TopicDetail),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  }
];
