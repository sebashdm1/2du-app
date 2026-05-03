import { Injectable, Signal, signal, computed } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';

export type FeatureFlagKey = 'nueva_ui_estadisticas';

const DEFAULTS: Record<FeatureFlagKey, boolean> = {
  nueva_ui_estadisticas: true,
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
      this.rc.settings.minimumFetchIntervalMillis = 0;
      await Promise.race([
        fetchAndActivate(this.rc),
        new Promise<void>((resolve) => setTimeout(resolve, 3000)),
      ]);
      this.flags.set({
        nueva_ui_estadisticas: getValue(this.rc, 'nueva_ui_estadisticas').asBoolean(),
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
