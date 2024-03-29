import './polyfills.ts';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

//https://stackoverflow.com/questions/51089478/angular-6-pwa-with-node-not-working
//platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
//  if ('serviceWorker' in navigator && environment.production) {
//    navigator.serviceWorker.register('ngsw-worker.js');
//  }
//}).catch(err => console.log(err));
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
