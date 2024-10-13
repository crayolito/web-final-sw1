import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  ExtraOptions,
  provideRouter,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions(),
      withRouterConfig(routerOptions)
    ),
    provideHttpClient(),
  ],
};
