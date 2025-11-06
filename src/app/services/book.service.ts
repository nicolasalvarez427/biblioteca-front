import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  _id: string;
  titulo: string;
  autor: string;
  imagenUrl?: string;
  disponible: boolean;
  stock: number;
}

export interface Loan {
  _id: string;
  libro: {
    _id: string;
    titulo: string;
    autor: string;
  };
  usuario: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  fechaDevuelto?: string; // ← agrega esta línea (opcional, porque puede no existir)
  devuelto: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:4000/api/libros';
  private prestamosUrl = 'http://localhost:4000/api/prestamos';

  constructor(private http: HttpClient) {}

  // 📚 Obtener libros
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // 🧾 Solicitar préstamo
  solicitarPrestamo(libroId: string): Observable<any> {
    return this.http.post(`${this.prestamosUrl}/solicitar/${libroId}`, {});
  }

  // 📘 Obtener préstamos del usuario autenticado
  getMisPrestamos(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.prestamosUrl}/mis-prestamos`);
  }

  // 🔄 Devolver libro
  devolverLibro(prestamoId: string): Observable<any> {
    return this.http.put(`${this.prestamosUrl}/devolver/${prestamoId}`, {});
  }
}
