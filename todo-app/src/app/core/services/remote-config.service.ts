import { Injectable, Signal, signal, computed } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';

export type FeatureFlagKey = 'dark_mode_enabled';

const DEFAULTS: Record<FeatureFlagKey, boolean> = {
  dark_mode_enabled: false,
};

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private readonly flags = signal<Record<FeatureFlagKey, boolean>>({ ...DEFAULTS });

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
        dark_mode_enabled: getValue(this.rc, 'dark_mode_enabled').asBoolean(),
      });
    } catch {
      // defaults already set in signal
    }
  }

  getFlag(key: FeatureFlagKey): boolean {
    return this.flags()[key];
  }

  flag(key: FeatureFlagKey): Signal<boolean> {
    return computed(() => this.flags()[key]);
  }
}
