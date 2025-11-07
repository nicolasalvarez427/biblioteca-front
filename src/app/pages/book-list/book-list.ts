import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.scss']
})
export class BookListComponent implements OnInit {
  private readonly bookService = inject(BookService);
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public books = signal<Book[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading.set(true);
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando libros:', err);
        this.isLoading.set(false);
      }
    });
  }

  onLoan(book: Book): void {
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para pedir un libro.');
      this.router.navigate(['/login']);
      return;
    }

    if (!book.disponible) {
      alert('Este libro no está disponible actualmente.');
      return;
    }

    if (confirm(`¿Confirmas el préstamo de "${book.titulo}"?`)) {
      this.bookService.solicitarPrestamo(book._id).subscribe({
        next: () => {
          alert('✅ ¡Préstamo realizado con éxito!');
          this.loadBooks();
        },
        error: (err) => {
          const msg = err?.error?.message || 'No se pudo realizar el préstamo.';
          alert(`❌ Error: ${msg}`);
        }
      });
    }
  }

  onEdit(book: Book): void {
    this.router.navigate(['/editar-libro', book._id]);
  }

  onDelete(book: Book): void {
    if (confirm(`¿Seguro que quieres eliminar el libro "${book.titulo}"?`)) {
      this.bookService.deleteBook(book._id).subscribe({
        next: (res) => {
          alert(`🗑️ ${res.message || 'Libro eliminado con éxito.'}`);
          this.loadBooks();
        },
        error: (err) => {
          const msg = err?.error?.message || 'No se pudo eliminar el libro.';
          alert(`❌ Error: ${msg}`);
        }
      });
    }
  }
}
