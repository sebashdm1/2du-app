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
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Ajustes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list inset="true" class="ion-margin-top">
        <ion-item button (click)="goToFeatureFlags()">
          <ion-icon slot="start" name="flag-outline" />
          <ion-label>
            <h2>Feature Flags</h2>
            <p>Demo Firebase Remote Config</p>
          </ion-label>
          <ion-badge color="tertiary">Demo</ion-badge>
          <ion-icon slot="end" name="chevron-forward-outline" />
        </ion-item>

        <ion-item>
          <ion-icon slot="start" name="construct-outline" />
          <ion-label>
            <h2>Configuracion general</h2>
            <p>Pendiente para siguiente iteracion</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <div style="height:84px"></div>
      <app-bottom-nav activeTab="settings" />
    </ion-content>
  `,
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
