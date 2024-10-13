import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (!navigator.geolocation) {
  alert('Geolocation is not available');
  throw new Error('Geolocation is not available');
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
