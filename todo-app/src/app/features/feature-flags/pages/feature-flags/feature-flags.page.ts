import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonBadge,
  IonBackButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { RemoteConfigService, FeatureFlagKey } from '../../../../core/services/remote-config.service';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonBadge,
    IonBackButton,
    IonButtons,
    IonList,
    IonItem,
    IonLabel,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tasks" />
        </ion-buttons>
        <ion-title>Feature Flags</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <h2>Sincronizacion Remote Config</h2>
          <p>{{ syncStatusText() }}</p>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-content>
          <h2>Flags disponibles</h2>
          <ion-list>
            @for (key of keys; track key) {
              <ion-item lines="full">
                <ion-label>
                  <h3>{{ key }}</h3>
                </ion-label>
                <ion-badge [color]="isActive(key) ? 'success' : 'medium'">
                  {{ isActive(key) ? 'ACTIVO' : 'INACTIVO' }}
                </ion-badge>
              </ion-item>
            }
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-content>
          <h2>Preview condicional</h2>
          @if (isActive('nueva_ui_estadisticas')) {
            <p>Nueva UI de estadisticas activada: muestra tarjetas de progreso enriquecidas.</p>
          } @else {
            <p>La nueva UI de estadisticas esta desactivada por feature flag.</p>
          }
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: [
    `
      h2 {
        margin: 0 0 8px;
        font-size: 1rem;
      }

      p {
        margin: 0;
        color: var(--ion-color-medium-shade);
      }
    `,
  ],
})
export class FeatureFlagsPage {
  private readonly remoteConfig = inject(RemoteConfigService);

  readonly keys = this.remoteConfig.getKeys();

  isActive(key: FeatureFlagKey): boolean {
    return this.remoteConfig.getFlag(key);
  }

  syncStatusText(): string {
    const status = this.remoteConfig.syncStatus();
    if (status === 'success') return 'Sincronizado correctamente con Firebase Remote Config';
    if (status === 'fallback') return 'Sin respuesta remota, usando defaults locales';
    return 'Sincronizacion en progreso';
  }
}
