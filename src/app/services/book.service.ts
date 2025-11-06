import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = '/api/books'; // Ajusta según tu backend

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // Método para futuros préstamos
  loanBook(bookId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${bookId}/loan`, {});
  }
}