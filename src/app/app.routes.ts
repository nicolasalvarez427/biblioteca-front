import { Routes } from '@angular/router';
// 1. Quita el '.component' del final de la ruta
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
];