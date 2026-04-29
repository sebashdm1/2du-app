import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/pages/task-list/task-list.page').then(
        (m) => m.TaskListPage,
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/pages/category-list/category-list.page').then(
        (m) => m.CategoryListPage,
      ),
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
