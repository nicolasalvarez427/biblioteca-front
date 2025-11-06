import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookService, Loan } from '../../services/book.service';

@Component({
  selector: 'app-loan-history',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './loan-history.html',
  styleUrls: ['./loan-history.scss']
})
export class LoanHistoryComponent implements OnInit {
  private readonly bookService = inject(BookService);

  public loans = signal<Loan[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadLoans();
  }

  /** 🔄 Carga los préstamos del usuario actual */
  loadLoans(): void {
    this.bookService.getMisPrestamos().subscribe({
      next: (data: Loan[]) => {
        this.loans.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error al cargar préstamos:', err);
        this.isLoading.set(false);
      }
    });
  }

  /** 📘 Devuelve un libro */
  onReturn(loan: Loan): void {
    if (!confirm('¿Confirmas la devolución de este libro?')) return;

    this.bookService.devolverLibro(loan._id).subscribe({
      next: () => {
        alert('✅ Libro devuelto correctamente.');
        this.loadLoans();
      },
      error: (err: any) => {
        console.error('Error al devolver libro:', err);
        alert('❌ Error al devolver: ' + (err.error?.message || 'Intenta nuevamente.'));
      }
    });
  }

  /** 📅 Calcula los días restantes para la devolución */
  getDaysRemaining(deadline: string): number {
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /** ⏳ Calcula la duración total del préstamo */
  getLoanDuration(start?: string, end?: string): number {
  if (!start || !end) return 0; // si alguno no está definido, devolvemos 0 días
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

}
