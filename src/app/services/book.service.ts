import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

// ✅ Interfaz pública para los préstamos
export interface Loan {
  _id: string;
  libro: Book;
  fechaPrestamo: string;
  fechaDevolucion: string;
  fechaRetornoReal?: string;
  devuelto: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/libros';
  private readonly prestamosUrl = '/api/prestamos';

  // 📚 Obtener todos los libros
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // 🤝 Solicitar un préstamo
  solicitarPrestamo(libroId: string): Observable<any> {
    return this.http.post(`${this.prestamosUrl}/solicitar/${libroId}`, {});
  }

  // 📖 Obtener préstamos del usuario actual
  getMisPrestamos(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.prestamosUrl}/mis-prestamos`);
  }

  // 🔙 Devolver un libro prestado
  devolverLibro(prestamoId: string): Observable<any> {
    return this.http.put(`${this.prestamosUrl}/devolver/${prestamoId}`, {});
  }

  // --- CAMBIO AQUÍ: Añadimos el nuevo método ---
  // 🆕 Crear un préstamo manualmente (solo admin)
  createLoanManual(data: { libroId: string, usuarioId: string, fechaDevolucion: string }): Observable<any> {
    // Llama a la ruta POST /api/prestamos
    return this.http.post(this.prestamosUrl, data);
  }
  // --- Fin del cambio ---

  // 🆕 Crear un nuevo libro (solo admin)
  createBook(data: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, data);
  }

  // ✏️ Actualizar libro existente (solo admin)
  updateBook(id: string, data: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, data);
  }

  // 🔍 Obtener un libro por ID
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  // 🗑️ Eliminar un libro (solo admin)
  deleteBook(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}