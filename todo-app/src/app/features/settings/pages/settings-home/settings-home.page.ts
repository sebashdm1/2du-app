import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, constructOutline, flagOutline } from 'ionicons/icons';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-settings-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonBadge,
    BottomNavComponent,
  ],
  templateUrl: './settings-home.page.html',
})
export class SettingsHomePage {
  private readonly router = inject(Router);

  constructor() {
    addIcons({ chevronForwardOutline, constructOutline, flagOutline });
  }

  goToFeatureFlags(): void {
    this.router.navigate(['/feature-flags']);
  }
}
