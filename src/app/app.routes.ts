import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register'; // Asegúrate de que la ruta de importación sea correcta
import { BookListComponent } from './pages/book-list/book-list';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // <-- Nueva ruta
  { path: 'books', component: BookListComponent }
];