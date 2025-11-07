import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Intefaz pública exportada para ser usada en otros componentes
export interface Usuario {
  _id: string;
  username: string;
  email: string;
  role: 'Administrador' | 'Estudiante';
  librosPrestados?: string[]; // Campo opcional para la lista de libros
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