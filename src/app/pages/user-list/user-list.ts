import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, Usuario } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

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

  public users = signal<Usuario[]>([]);
  public isLoading = signal(true);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (data: Usuario[]) => { // Tipo explícito añadido
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => { // Tipo 'any' explícito añadido
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
        error: (err: any) => { // Tipo 'any' explícito añadido
          alert(`❌ Error: ${err?.error?.message || 'No se pudo eliminar el usuario.'}`);
        }
      });
    }
  }
}