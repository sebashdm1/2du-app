import { ApplicationConfig, provideAppInitializer, inject, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { StorageService } from './core/services/storage.service';
import { RemoteConfigService } from './core/services/remote-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular({}),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideRemoteConfig(() => getRemoteConfig()),
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__appdb',
        driverOrder: [
          CordovaSQLiteDriver._driver,
          Drivers.IndexedDB,
          Drivers.LocalStorage,
        ],
      }),
    ),
    provideAppInitializer(() => inject(StorageService).initialize()),
    provideAppInitializer(() => inject(RemoteConfigService).initialize()),
  ],
};
