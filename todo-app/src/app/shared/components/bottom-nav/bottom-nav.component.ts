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
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
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
