import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// --- CAMBIO 1: Importamos 'firstValueFrom' de RxJS ---
import { firstValueFrom } from 'rxjs'; 
import { BookService } from '../../services/book.service';
import { UserService, Usuario } from '../../services/user.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-admin-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-loan-form.html',
  styleUrl: './admin-loan-form.scss'
})
export class AdminLoanFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private bookService = inject(BookService);
  private userService = inject(UserService);

  public form: FormGroup;
  public isLoading = signal(true);
  
  // Señales para los datos de los <select>
  private allBooks = signal<Book[]>([]);
  public allUsers = signal<Usuario[]>([]);

  // Señal computada para mostrar solo libros con stock
  public availableBooks = computed(() => {
    return this.allBooks().filter(book => book.disponible && book.stock! > 0);
  });

  constructor() {
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    
    this.form = this.fb.group({
      usuarioId: ['', Validators.required],
      libroId: ['', Validators.required],
      // Damos por defecto una semana de préstamo
      fechaDevolucion: [nextWeek.toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  // --- CAMBIO 2: Hacemos el método 'async' ---
  async loadData(): Promise<void> {
    this.isLoading.set(true);
    
    // --- CAMBIO 3: Usamos 'await' y 'firstValueFrom' en lugar de .then() ---
    try {
      // Cargamos usuarios y libros en paralelo
      const [books, users] = await Promise.all([
        firstValueFrom(this.bookService.getBooks()),
        firstValueFrom(this.userService.getAllUsers())
      ]);

      this.allBooks.set(books || []);
      // Filtramos para no prestar libros a otros admins
      this.allUsers.set(users?.filter(u => u.role === 'Estudiante') || []);
      
    } catch (err) {
      console.error('Error cargando datos:', err);
      alert('Error al cargar libros y usuarios.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;

    if (confirm('¿Confirmas la creación de este préstamo?')) {
      this.bookService.createLoanManual(data).subscribe({
        next: () => {
          alert('✅ Préstamo manual creado con éxito.');
          this.router.navigate(['/admin/usuarios']);
        },
        error: (err) => {
          alert('❌ Error al crear préstamo: ' + (err.error?.message || 'Error desconocido.'));
        }
      });
    }
  }
  
  volver(): void {
    this.router.navigate(['/admin/usuarios']);
  }
}