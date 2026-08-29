import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page').then((c) => c.DashboardPage),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tasks/pages/tasks-page/tasks-page').then((c) => c.TasksPage),
  },
  {
    path: 'tasks/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tasks/pages/task-form-page/task-form-page').then((c) => c.TaskFormPage),
  },
  {
    path: 'tasks/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/tasks/pages/task-detail-page/task-detail-page').then((c) => c.TaskDetailPage),
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categories/pages/categories-page/categories-page').then((c) => c.CategoriesPage),
  },
  {
    path: 'categories/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categories/pages/category-form-page/category-form-page').then(
        (c) => c.CategoryFormPage,
      ),
  },
  {
    path: 'categories/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/categories/pages/category-detail-page/category-detail-page').then(
        (c) => c.CategoryDetailPage,
      ),
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