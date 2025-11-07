import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-dark bg-primary sticky-top shadow-sm px-3">
      <div class="container-fluid d-flex align-items-center text-nowrap">
        
        <a class="navbar-brand fw-bold d-flex align-items-center me-0" routerLink="/books">
          <span class="fs-2 me-2">📖</span> 
          <span class="d-none d-xl-inline">Biblioteca</span>
        </a>

        @if (authService.isAuthenticated()) {
          <div class="d-flex flex-grow-1 justify-content-evenly align-items-center mx-3 overflow-auto custom-scroll">
            
            <a class="nav-link" routerLink="/books" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <span class="me-1">📚</span> <span class="d-none d-lg-inline">Catálogo</span>
            </a>
            <a class="nav-link" routerLink="/buscar" routerLinkActive="active">
              <span class="me-1">🔎</span> <span class="d-none d-lg-inline">Buscador</span>
            </a>
            <a class="nav-link" routerLink="/mis-prestamos" routerLinkActive="active">
              <span class="me-1">📂</span> <span class="d-none d-lg-inline">Mis Préstamos</span>
            </a>

            @if (authService.isAdmin()) {
              <div class="vr text-light opacity-25 mx-2 d-none d-md-block"></div> <a class="nav-link admin-link" routerLink="/admin/libros/nuevo" routerLinkActive="active">
                <span class="me-1">➕</span> <span class="d-none d-xl-inline">Nuevo Libro</span>
              </a>
              <a class="nav-link admin-link" routerLink="/admin/prestamos/nuevo" routerLinkActive="active">
                <span class="me-1">📝</span> <span class="d-none d-xl-inline">Préstamo</span>
              </a>
              <a class="nav-link admin-link" routerLink="/admin/usuarios" routerLinkActive="active">
                <span class="me-1">👥</span> <span class="d-none d-xl-inline">Usuarios</span>
              </a>
            }

          </div>
        } @else {
          <div class="flex-grow-1"></div>
        }

        <div class="d-flex align-items-center gap-3 ms-auto">
          @if (authService.isAuthenticated()) {
            
            <div class="d-flex align-items-center text-light">
              <span class="badge fw-bold me-2 d-none d-md-inline-block" 
                    [ngClass]="{
                      'bg-warning text-dark': authService.currentUser()?.role === 'Administrador',
                      'bg-info text-dark': authService.currentUser()?.role === 'Estudiante'
                    }">
                {{ authService.currentUser()?.role | slice:0:1 }}
              </span>
              <span class="fw-semibold d-none d-md-block" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis;">
                {{ authService.currentUser()?.username }}
              </span>
            </div>
            
            <div class="vr text-light opacity-50 d-none d-md-block" style="height: 25px;"></div>

            <button class="btn btn-danger btn-sm d-flex align-items-center fw-semibold shadow-sm" 
                    (click)="logout()" title="Cerrar Sesión">
              <span class="fs-6">🚪</span>
            </button>

          } @else {
            <a routerLink="/login" class="btn btn-light fw-bold btn-sm shadow-sm text-nowrap">
              🔐 Ingresar
            </a>
          }
        </div>

      </div>
    </nav>
  `,
  styles: [`
    .navbar { z-index: 1030; height: 60px; }

    .nav-link {
      color: rgba(255,255,255,0.85) !important;
      padding: 0.5rem 0.8rem !important;
      border-radius: 50px;
      transition: all 0.2s ease;
      white-space: nowrap; /* Evita que el texto de los enlaces se rompa en dos líneas */

      &:hover {
        color: #fff !important;
        background-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
      }

      &.active {
        background-color: #fff !important;
        color: var(--bs-primary) !important;
        font-weight: 700;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
    }

    .admin-link {
      /* Un toque sutilmente diferente para los links de admin si quieres */
      &.active {
         color: var(--bs-indigo) !important; /* Opcional: un color distinto para admin activo */
      }
    }
    
    /* Para que si la pantalla es MUY pequeña, se pueda hacer scroll horizontal en el menú en lugar de romper todo */
    .custom-scroll::-webkit-scrollbar { height: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
    .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.5); border-radius: 4px; }
  `]
})
export class HeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  // Ya no necesitamos señales para el menú desplegable
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}