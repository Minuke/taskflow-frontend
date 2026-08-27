import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page').then((c) => c.DashboardPage),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/pages/tasks-page/tasks-page').then((c) => c.TasksPage),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/pages/categories-page/categories-page').then((c) => c.CategoriesPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then((c) => c.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page').then((c) => c.RegisterPage),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];