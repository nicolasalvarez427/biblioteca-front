import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- Importar withInterceptors
import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './app.routes';
// Importa tu interceptor
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // AQUÍ ESTÁ LA CLAVE: Registramos el interceptor para que Angular lo use
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(ReactiveFormsModule)
  ]
};