import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
// 1. CORRECCIÓN: Importa la FUNCIÓN, no el MÓDULO
import { provideReactiveFormsModule } from '@angular/forms'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideReactiveFormsModule() // 2. CORRECCIÓN: Llama a la función
  ]
};