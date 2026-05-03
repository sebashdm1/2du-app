import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { BottomNavComponent, BottomTab } from './shared/components/bottom-nav/bottom-nav.component';

const TAB_ROUTES: Record<string, BottomTab> = {
  tasks: 'tasks',
  categories: 'categories',
  stats: 'stats',
  settings: 'settings',
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, BottomNavComponent],
  template: `
    <ion-app>
      <ion-router-outlet />
      @if (activeTab()) {
        <app-bottom-nav [activeTab]="activeTab()!" />
      }
    </ion-app>
  `,
})
export class AppComponent {
  protected readonly activeTab = signal<BottomTab | null>('tasks');

  constructor(router: Router) {
    router.events.subscribe(e => {
      if (!(e instanceof NavigationEnd)) return;
      const segment = e.urlAfterRedirects.split('/')[1]?.split('?')[0] ?? '';
      this.activeTab.set(TAB_ROUTES[segment] ?? null);
    });
  }
}
