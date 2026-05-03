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
    path: 'feature-flags',
    loadComponent: () =>
      import('./features/feature-flags/pages/feature-flags/feature-flags.page').then(
        (m) => m.FeatureFlagsPage,
      ),
  },
  {
    path: 'filters',
    loadComponent: () =>
      import('./features/tasks/pages/task-filters/task-filters.page').then(
        (m) => m.TaskFiltersPage,
      ),
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./features/stats/pages/stats-home/stats-home.page').then(
        (m) => m.StatsHomePage,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/pages/settings-home/settings-home.page').then(
        (m) => m.SettingsHomePage,
      ),
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
