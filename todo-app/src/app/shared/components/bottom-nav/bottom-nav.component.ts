import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  barChartOutline,
  checkmarkCircleOutline,
  pricetagOutline,
  settingsOutline,
} from 'ionicons/icons';

export type BottomTab = 'tasks' | 'categories' | 'stats' | 'settings';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
  template: `
    <nav class="bottom-nav" aria-label="Navegacion principal">
      <button type="button" [class.active]="activeTab === 'tasks'" (click)="goTo('/tasks')">
        <ion-icon name="checkmark-circle-outline" />
        <span>Tareas</span>
      </button>

      <button type="button" [class.active]="activeTab === 'categories'" (click)="goTo('/categories')">
        <ion-icon name="pricetag-outline" />
        <span>Categorías</span>
      </button>

      <button type="button" class="add-btn" (click)="createTask()" aria-label="Nueva tarea">
        <ion-icon name="add-outline" />
      </button>

      <button type="button" [class.active]="activeTab === 'stats'" (click)="goTo('/stats')">
        <ion-icon name="bar-chart-outline" />
        <span>Stats</span>
      </button>

      <button type="button" [class.active]="activeTab === 'settings'" (click)="goTo('/settings')">
        <ion-icon name="settings-outline" />
        <span>Ajustes</span>
      </button>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      left: 0; right: 0; bottom: 0;
      height: 70px;
      background: #ffffff;
      border-top: 1px solid #EAE0F7;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      align-items: center;
      z-index: 20;
      padding: 0 4px calc(env(safe-area-inset-bottom) / 2);
    }

    .bottom-nav button {
      border: 0;
      background: transparent;
      color: #9585B8;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      min-width: 56px;
      padding: 6px 8px;
      border-radius: 12px;
    }

    .bottom-nav button.active {
      color: #16092E;
    }

    .bottom-nav ion-icon {
      font-size: 20px;
    }

    .add-btn {
      width: 48px !important;
      height: 48px !important;
      border-radius: 50% !important;
      margin: 0 auto;
      background: #E91E8C !important;
      color: #fff !important;
      transform: translateY(-14px);
      box-shadow: 0 4px 16px rgba(233, 30, 140, 0.4);
      padding: 0 !important;
    }

    .add-btn ion-icon {
      font-size: 24px;
    }
  `],
})
export class BottomNavComponent {
  @Input({ required: true }) activeTab!: BottomTab;

  private readonly router = inject(Router);

  constructor() {
    addIcons({ addOutline, barChartOutline, checkmarkCircleOutline, pricetagOutline, settingsOutline });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  createTask(): void {
    this.router.navigate(['/tasks'], {
      queryParams: { create: Date.now() },
      queryParamsHandling: 'merge',
    });
  }
}
