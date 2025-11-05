import { Routes } from '@angular/router';
// 1. Importa tu componente desde la ruta correcta (login.ts)
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  // 2. Añade la ruta
  {
    path: 'login',
    component: LoginComponent
  },
];