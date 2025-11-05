import { Routes } from '@angular/router';
// 1. Importa tu nueva página de login
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  // 2. Añade la ruta
  {
    path: 'login',
    component: LoginComponent
  },
  // (Aquí irán las otras rutas)
];