import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { RemoteConfigService, FeatureFlagKey } from '../../../../core/services/remote-config.service';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonContent, IonBackButton, IonButtons, BottomNavComponent],
  templateUrl: './feature-flags.page.html',
  styleUrl: './feature-flags.page.scss',
})
export class FeatureFlagsPage {
  private readonly remoteConfig = inject(RemoteConfigService);

  readonly keys = this.remoteConfig.getKeys();

  isActive(key: FeatureFlagKey): boolean {
    return this.remoteConfig.getFlag(key);
  }

  syncLabel(): string {
    const status = this.remoteConfig.syncStatus();
    if (status === 'success') return 'Sincronizado';
    if (status === 'fallback') return 'Usando defaults';
    return 'Sincronizando...';
  }

  flagLabel(key: FeatureFlagKey): string {
    const labels: Record<FeatureFlagKey, string> = {
      nueva_ui_estadisticas: '📊 Dashboard de Estadísticas',
    };
    return labels[key] ?? key;
  }
}
