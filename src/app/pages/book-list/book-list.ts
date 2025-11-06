import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService, Loan } from '../../services/book.service';
import { Book } from '../../models/book.model';
// Importaciones necesarias para que funcione todo
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss'
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  // Inyectamos estos servicios para poder usarlos
  public authService = inject(AuthService);
  private router = inject(Router);

  // --- SIGNALS QUE FALTABAN ---
  // Estos son los que causan el error si no están definidos
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
        console.error('Error al cargar libros:', err);
        this.isLoading.set(false);
      }
    });
  }

  // --- MÉTODO QUE FALTABA PARA EL BOTÓN "PRESTAR" ---
  onLoan(book: Book) {
    // 1. Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para pedir un libro.');
      this.router.navigate(['/login']);
      return;
    }

    // 2. Confirmar la acción
    if (!confirm(`¿Confirmas el préstamo de "${book.titulo}"?`)) return;

    // 3. Llamar al servicio
    this.bookService.solicitarPrestamo(book._id).subscribe({
      next: () => {
        alert('✅ ¡Préstamo realizado con éxito!');
        this.loadBooks(); // Recargar la lista para ver el stock actualizado
      },
      error: (err) => {
        alert('❌ Error: ' + (err.error?.message || 'No se pudo realizar el préstamo.'));
      }
    });
  }
}