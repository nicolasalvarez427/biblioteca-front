import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideReactiveFormsModule } from '@angular/forms'; // <-- 1. IMPORTA ESTO

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideReactiveFormsModule() // <-- 2. AÑADE ESTO AQUÍ
  ]
};