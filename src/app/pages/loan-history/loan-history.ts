import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookService, Loan } from '../../services/book.service';

@Component({
  selector: 'app-loan-history',
  standalone: true,
  imports: [CommonModule, DatePipe], // Importamos DatePipe para formatear fechas en el HTML
  templateUrl: './loan-history.html',
  styleUrl: './loan-history.scss'
})
export class LoanHistoryComponent implements OnInit {
  private bookService = inject(BookService);

  public loans = signal<Loan[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadLoans();
  }

  loadLoans() {
    this.bookService.getMisPrestamos().subscribe({
      next: (data) => {
        this.loans.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  onReturn(loan: Loan) {
    if (!confirm('¿Confirmas la devolución de este libro?')) return;

    this.bookService.devolverLibro(loan._id).subscribe({
      next: () => {
        alert('✅ Libro devuelto correctamente.');
        this.loadLoans(); // Recargar la lista para ver el cambio
      },
      error: (err) => alert('❌ Error al devolver: ' + err.error?.message)
    });
  }

  // Calcula días restantes para la fecha límite
  getDaysRemaining(deadline: string): number {
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Calcula cuánto tiempo se tuvo el libro (entre préstamo y devolución real)
  getLoanDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    // Mínimo 1 día si lo devuelve el mismo día
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
}