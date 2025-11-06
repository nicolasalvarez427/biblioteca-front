import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = '/api/libros';
  private prestamosUrl = '/api/prestamos'; // <-- Nueva URL base

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // NUEVO MÉTODO: Conecta con la ruta que creamos en el backend
  solicitarPrestamo(libroId: string): Observable<any> {
    return this.http.post(`${this.prestamosUrl}/solicitar/${libroId}`, {});
  }
}