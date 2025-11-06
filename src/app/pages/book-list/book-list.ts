import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { AuthService } from '../../services/auth.service'; // <-- Importante
import { Router } from '@angular/router'; // <-- Importante

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss'
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private authService = inject(AuthService); // <-- Inyectamos AuthService
  private router = inject(Router);           // <-- Inyectamos Router

  public books = signal<Book[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadBooks();
  }

loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        console.log('🔍 DATOS EXACTOS DE MONGO:', data); // <--- ¡ESTA LÍNEA ES CLAVE!
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Este es el método que faltaba y que el HTML estaba buscando
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}