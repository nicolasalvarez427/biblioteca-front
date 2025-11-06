import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  // 1. AÑADE ESTA RUTA DE REDIRECCIÓN:
  // Cuando alguien visite la raíz (''), redirige a '/login'
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  
  // 2. Tu ruta de login que ya tenías:
  {
    path: 'login',
    component: LoginComponent
  },
];