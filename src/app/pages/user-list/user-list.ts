import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, Usuario } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
// --- CAMBIO 1: Importamos BookService ---
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  public readonly authService = inject(AuthService);
  // --- CAMBIO 2: Inyectamos BookService ---
  private readonly bookService = inject(BookService);

  public users = signal<Usuario[]>([]);
  public isLoading = signal(true);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (data: Usuario[]) => { 
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => { 
        console.error('Error al cargar usuarios:', err);
        this.isLoading.set(false);
      }
    });
  }

  onDelete(id: string, username: string) {
    if (confirm(`¿Seguro que deseas eliminar al usuario "${username}"?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('✅ Usuario eliminado correctamente.');
          this.loadUsers();
        },
        error: (err: any) => { 
          alert(`❌ Error: ${err?.error?.message || 'No se pudo eliminar el usuario.'}`);
        }
      });
    }
  }

  // --- CAMBIO 3: Añadimos el método para que el Admin devuelva el libro ---
  onDevolver(prestamoId: string, libroTitulo: string, username: string) {
    if (confirm(`¿Confirmas la devolución del libro "${libroTitulo}" del usuario "${username}"?`)) {
      this.bookService.devolverLibro(prestamoId).subscribe({
        next: () => {
          alert('✅ Libro devuelto correctamente por el administrador.');
          this.loadUsers(); // Recargamos la lista de usuarios para que se actualice
        },
        error: (err: any) => {
          alert(`❌ Error al devolver: ${err?.error?.message || 'No se pudo procesar la devolución.'}`);
        }
      });
    }
  }
}