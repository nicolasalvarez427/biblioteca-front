import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.scss']
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  public authService = inject(AuthService);
  private router = inject(Router);

  public books = signal<Book[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  onLoan(book: Book) {
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para pedir un libro.');
      this.router.navigate(['/login']);
      return;
    }

    if (!confirm(`¿Confirmas el préstamo de "${book.titulo}"?`)) return;

    this.bookService.solicitarPrestamo(book._id).subscribe({
      next: () => {
        alert('✅ ¡Préstamo realizado con éxito!');
        this.loadBooks();
      },
      error: (err) => {
        alert('❌ Error: ' + (err.error?.message || 'No se pudo realizar el préstamo.'));
      }
    });
  }
}
