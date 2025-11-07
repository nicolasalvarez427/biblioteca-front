import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { BookListComponent } from './pages/book-list/book-list';
import { LoanHistoryComponent } from './pages/loan-history/loan-history';
import { BookFormComponent } from './pages/book-form/book-form';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { UserListComponent } from './pages/user-list/user-list';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 🔹 Usuarios autenticados
  { path: 'books', component: BookListComponent, canActivate: [authGuard] },
  { path: 'mis-prestamos', component: LoanHistoryComponent, canActivate: [authGuard] },

  // 🔹 Solo administradores
  { path: 'admin/libros', component: BookListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/libros/nuevo', component: BookFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/libros/editar/:id', component: BookFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/usuarios', component: UserListComponent, canActivate: [authGuard, adminGuard] }
];
