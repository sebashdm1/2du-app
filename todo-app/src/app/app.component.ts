import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RemoteConfigService } from './core/services/remote-config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `<ion-app><ion-router-outlet /></ion-app>`,
})
export class AppComponent implements OnInit {
  private remoteConfig = inject(RemoteConfigService);

  ngOnInit(): void {
    const isDark = this.remoteConfig.getFlag('dark_mode_enabled');
    document.body.classList.toggle('dark', isDark);
  }
}
