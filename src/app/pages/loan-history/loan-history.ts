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

  getDaysRemaining(deadline: string): number {
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /** ⏳ Calcula la duración exacta en formato legible */
  getDetailedDuration(start?: string, end?: string): string {
    if (!start || !end) return '-';

    const startDate = new Date(start);
    const endDate = new Date(end);
    let diffMs = endDate.getTime() - startDate.getTime();

    // Evitar valores negativos por si acaso
    diffMs = Math.max(0, diffMs);

    // Cálculos de tiempo
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diffMs / (1000 * 60));

    // Construir el string resultante
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}min`);

    return parts.join(' ');
  }
}