import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, Usuario } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="text-center mb-4 text-primary fw-bold">👥 Lista de Usuarios Registrados</h2>

      @if (isLoading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
      } @else {
        @if (users().length > 0) {
          <div class="table-responsive shadow rounded">
            <table class="table table-striped align-middle mb-0">
              <thead class="table-primary text-center">
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody class="text-center">
                @for (user of users(); track user._id) {
                  <tr>
                    <td>{{ user.username }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span class="badge rounded-pill px-3 py-2 fw-semibold"
                            [ngClass]="{
                              'bg-warning text-dark': user.role === 'Administrador',
                              'bg-info text-dark': user.role === 'Estudiante'
                            }">
                        {{ user.role }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-outline-danger btn-sm fw-semibold"
                              (click)="deleteUser(user)">
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <p class="text-center text-muted fs-5 py-5">No hay usuarios registrados.</p>
        }
      }
    </div>
  `,
  styles: [`
    .table { border-radius: 0.5rem; overflow: hidden; }
    .badge { font-size: 0.8rem; }
  `]
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  public users = signal<Usuario[]>([]);
  public isLoading = signal(true);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoading.set(false);
      }
    });
  }

  deleteUser(user: Usuario) {
    if (confirm(`¿Seguro que deseas eliminar al usuario "${user.username}"?`)) {
      this.userService.deleteUser(user._id).subscribe({
        next: () => {
          alert('✅ Usuario eliminado correctamente.');
          this.loadUsers();
        },
        error: (err) => {
          alert(`❌ Error: ${err?.error?.message || 'No se pudo eliminar el usuario.'}`);
        }
      });
    }
  }
}
