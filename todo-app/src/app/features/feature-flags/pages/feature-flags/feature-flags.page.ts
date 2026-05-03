import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { RemoteConfigService, FeatureFlagKey } from '../../../../core/services/remote-config.service';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonContent, IonBackButton, IonButtons, BottomNavComponent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="page-header">
          <div class="header-row">
            <ion-buttons>
              <ion-back-button defaultHref="/settings" text="" color="light" />
            </ion-buttons>
            <span class="back-label">Ajustes</span>
          </div>
          <h2 class="header-title">Feature Flags</h2>
          <p class="header-sub">Firebase Remote Config</p>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ff-content">
      <div class="ff-body">
        <div class="firebase-badge">
          <div class="firebase-dot"></div>
          Firebase Remote Config · {{ syncLabel() }}
        </div>

        @for (key of keys; track key) {
          <div class="ff-card">
            <div class="ff-card-header">
              <div class="ff-card-info">
                <div class="ff-card-title">{{ flagLabel(key) }}</div>
                <div class="ff-card-sub">{{ key }}</div>
              </div>
              <div class="ff-card-status">
                <span class="ff-badge" [class.badge-on]="isActive(key)" [class.badge-off]="!isActive(key)">
                  {{ isActive(key) ? 'ACTIVO' : 'INACTIVO' }}
                </span>
                <div class="toggle" [class.on]="isActive(key)"></div>
              </div>
            </div>
          </div>
        }
      </div>

      <div class="footer-spacer"></div>
      <app-bottom-nav activeTab="settings" />
    </ion-content>
  `,
  styles: [`
    ion-toolbar { --background: #16092E; --padding-bottom: 20px; }

    .page-header { padding: 8px 16px 0; }
    .header-row { display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
    .back-label { font-size: 14px; color: rgba(255,255,255,0.6); }
    .header-title { margin: 0; font-size: 20px; font-weight: 800; color: #fff; }
    .header-sub { margin: 4px 0 0; font-size: 12px; color: rgba(255,255,255,0.5); }

    .ff-content { --background: #F8F5FF; }

    .ff-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .firebase-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,160,0,0.1);
      border: 1px solid rgba(255,160,0,0.2);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 12px;
      color: #FF9800;
      font-weight: 600;
    }

    .firebase-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #FF9800;
      flex-shrink: 0;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .ff-card {
      background: #fff;
      border-radius: 16px;
      border: 1.5px solid #EAE0F7;
      overflow: hidden;
    }

    .ff-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
    }

    .ff-card-title { font-size: 14px; font-weight: 700; color: #16092E; }
    .ff-card-sub { font-size: 11px; color: #9585B8; margin-top: 2px; font-family: monospace; }

    .ff-card-status {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    .ff-badge {
      padding: 3px 10px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
    }

    .badge-on  { background: rgba(34,197,94,0.12); color: #22C55E; }
    .badge-off { background: rgba(239,68,68,0.1);  color: #EF4444; }

    .toggle {
      width: 44px; height: 24px;
      border-radius: 12px;
      background: #EAE0F7;
      position: relative;
    }

    .toggle.on { background: #E91E8C; }

    .toggle::after {
      content: '';
      position: absolute;
      top: 2px; left: 2px;
      width: 20px; height: 20px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      transition: transform 0.2s;
    }

    .toggle.on::after { transform: translateX(20px); }

    .footer-spacer { height: 84px; }
  `],
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
      ai_smart_reminders:    '🔔 Recordatorios inteligentes',
      custom_themes_v2:      '🎨 Temas personalizados',
    };
    return labels[key] ?? key;
  }
}
