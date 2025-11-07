import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm px-3">
      <div class="container-fluid d-flex align-items-center text-nowrap">
        
        <div class="navbar-brand fw-bold d-flex align-items-center me-4">
          <span class="fs-4 me-2">📖</span> 
          <span>Biblioteca</span>
        </div>

        @if (authService.isAuthenticated()) {
          <div class="d-flex flex-grow-1 justify-content-evenly align-items-center mx-3 overflow-auto custom-scroll">
            
            <a class="nav-link" routerLink="/books" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <span class="me-1">📚</span> Catálogo
            </a>
            <a class="nav-link" routerLink="/buscar" routerLinkActive="active">
              <span class="me-1">🔎</span> Buscador
            </a>
            <a class="nav-link" routerLink="/mis-prestamos" routerLinkActive="active">
              <span class="me-1">📂</span> Mis Préstamos
            </a>

            @if (authService.isAdmin()) {
              <div class="vr text-light opacity-25 mx-2 d-none d-md-block"></div>
              <a class="nav-link admin-link" routerLink="/admin/libros/nuevo" routerLinkActive="active">
                <span class="me-1">➕</span> Nuevo Libro
              </a>
              <a class="nav-link admin-link" routerLink="/admin/prestamos/nuevo" routerLinkActive="active">
                <span class="me-1">📝</span> Préstamo
              </a>
              <a class="nav-link admin-link" routerLink="/admin/usuarios" routerLinkActive="active">
                <span class="me-1">👥</span> Usuarios
              </a>
            }

          </div>
        } @else {
          <div class="flex-grow-1"></div>
        }

        <div class="d-flex align-items-center gap-3 ms-auto">
          @if (authService.isAuthenticated()) {
            
            <div class="d-flex align-items-center text-light">
              <span class="badge fw-bold me-2" 
                    [ngClass]="{
                      'bg-warning text-dark': authService.currentUser()?.role === 'Administrador',
                      'bg-info text-dark': authService.currentUser()?.role === 'Estudiante'
                    }"
                    style="font-size: 0.75rem; letter-spacing: 0.5px;">
                {{ authService.currentUser()?.role | uppercase }}
              </span>
              <span class="fw-semibold d-none d-md-block" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis;">
                {{ authService.currentUser()?.username }}
              </span>
            </div>
            
            <div class="vr text-light opacity-50 d-none d-md-block" style="height: 25px;"></div>

            <button class="btn btn-danger btn-sm d-flex align-items-center fw-semibold shadow-sm" 
                    (click)="logout()" title="Cerrar Sesión">
              <span class="fs-6 me-2">🚪</span> Cerrar Sesión
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
      /* Color base distinto y Fondo Sutil */
      color: #fff !important; 
      padding: 0.5rem 0.8rem !important;
      border-radius: 50px;
      transition: all 0.2s ease;
      white-space: nowrap; 
      background-color: rgba(255, 255, 255, 0.1); 
      
      /* Hover Distintivo */
      &:hover {
        color: #fff !important;
        background-color: rgba(255, 255, 255, 0.25); 
        transform: scale(1.05) translateY(-2px); 
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      /* Estado Activo */
      &.active {
        background-color: #fff !important;
        color: var(--bs-primary) !important;
        font-weight: 700;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
    }

    .custom-scroll::-webkit-scrollbar { height: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
    .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.5); border-radius: 4px; }
  `]
})
export class HeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}