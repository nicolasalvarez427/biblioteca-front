import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss'
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);

  // Signals para el estado
  public books = signal<Book[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading.set(true);
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando libros', err);
        this.isLoading.set(false);
      }
    });
  }

  onLoan(book: Book) {
    if (!book.available) return;
    // Aquí implementarías la lógica de préstamo
    console.log('Prestar libro:', book.title);
  }
}