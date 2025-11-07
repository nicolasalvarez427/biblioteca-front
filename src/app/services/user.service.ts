import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- CAMBIO AQUÍ: Definimos la interfaz para el préstamo anidado ---
export interface PrestamoSimple {
  _id: string; // Este es el ID del préstamo
  titulo: string;
}

// Intefaz pública exportada para ser usada en otros componentes
export interface Usuario {
  _id: string;
  username: string;
  email: string;
  role: 'Administrador' | 'Estudiante';
  // --- CAMBIO AQUÍ: 'librosPrestados' es ahora un array de 'PrestamoSimple' ---
  librosPrestados?: PrestamoSimple[]; 
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/api/users');
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`/api/users/${id}`);
  }
}