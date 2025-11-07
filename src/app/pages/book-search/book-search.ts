import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-search.html',
  styleUrl: './book-search.scss'
})
export class BookSearchComponent implements OnInit {
  private readonly bookService = inject(BookService);
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public allBooks = signal<Book[]>([]);
  public isLoading = signal(true);
  public searchTerm = signal<string>('');

  // Señal computada para los libros filtrados
  public filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const books = this.allBooks();

    if (!term) {
      return []; // No mostrar nada si no hay búsqueda
    }
    
    return books.filter(book => 
      book.titulo.toLowerCase().includes(term) ||
      book.autor.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading.set(true);
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.allBooks.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando libros:', err);
        this.isLoading.set(false);
      }
    });
  }
  
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  // Mantenemos la lógica de préstamo y admin
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
        error: (err) => alert(`❌ Error: ${err?.error?.message || 'Error'}`)
      });
    }
  }

  onEdit(book: Book): void {
    this.router.navigate(['/admin/libros/editar', book._id]);
  }

  onDelete(book: Book): void {
    if (confirm(`¿Seguro que quieres eliminar el libro "${book.titulo}"?`)) {
      this.bookService.deleteBook(book._id).subscribe({
        next: (res) => {
          alert(`🗑️ ${res.message || 'Libro eliminado con éxito.'}`);
          this.loadBooks();
        },
        error: (err) => alert(`❌ Error: ${err?.error?.message || 'Error'}`)
      });
    }
  }
}