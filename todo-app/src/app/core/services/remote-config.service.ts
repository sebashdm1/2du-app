import { Injectable, Signal, signal, computed } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';

export type FeatureFlagKey =
  | 'nueva_ui_estadisticas'
  | 'ai_smart_reminders'
  | 'custom_themes_v2';

const DEFAULTS: Record<FeatureFlagKey, boolean> = {
  nueva_ui_estadisticas: true,
  ai_smart_reminders: false,
  custom_themes_v2: false,
};

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private readonly flags = signal<Record<FeatureFlagKey, boolean>>({ ...DEFAULTS });
  readonly syncStatus = signal<'idle' | 'success' | 'fallback'>('idle');

  constructor(private rc: RemoteConfig) {
    this.rc.defaultConfig = DEFAULTS;
  }

  async initialize(): Promise<void> {
    try {
      this.rc.settings.minimumFetchIntervalMillis = 3_600_000;
      await Promise.race([
        fetchAndActivate(this.rc),
        new Promise<void>((resolve) => setTimeout(resolve, 3000)),
      ]);
      this.flags.set({
        nueva_ui_estadisticas: getValue(this.rc, 'nueva_ui_estadisticas').asBoolean(),
        ai_smart_reminders: getValue(this.rc, 'ai_smart_reminders').asBoolean(),
        custom_themes_v2: getValue(this.rc, 'custom_themes_v2').asBoolean(),
      });
      this.syncStatus.set('success');
    } catch {
      // defaults already set in signal
      this.syncStatus.set('fallback');
    }
  }

  getAllFlags(): Record<FeatureFlagKey, boolean> {
    return this.flags();
  }

  getKeys(): FeatureFlagKey[] {
    return Object.keys(DEFAULTS) as FeatureFlagKey[];
  }

  getFlag(key: FeatureFlagKey): boolean {
    return this.flags()[key];
  }

  flag(key: FeatureFlagKey): Signal<boolean> {
    return computed(() => this.flags()[key]);
  }
}
