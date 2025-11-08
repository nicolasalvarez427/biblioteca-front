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
      <div class="container-fluid">
        
        <div class="navbar-brand fw-bold d-flex align-items-center me-4">
          <span class="fs-4 me-2">📖</span> 
          <span>Biblioteca</span>
        </div>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
           <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          
          @if (authService.isAuthenticated()) {
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
              
              <li class="nav-item">
                <a class="nav-link" routerLink="/books" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                  <span class="me-1">📚</span> Catálogo
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/buscar" routerLinkActive="active">
                  <span class="me-1">🔎</span> Buscador
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/mis-prestamos" routerLinkActive="active">
                  <span class="me-1">📂</span> Mis Préstamos
                </a>
              </li>

              @if (authService.isAdmin()) {
                <div class="vr text-light opacity-25 mx-2 d-none d-lg-block"></div>
                <hr class="d-lg-none text-white-50 my-2">
                
                <li class="nav-item">
                  <a class="nav-link admin-link" routerLink="/admin/libros/nuevo" routerLinkActive="active">
                    <span class="me-1">➕</span> Nuevo Libro
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link admin-link" routerLink="/admin/prestamos/nuevo" routerLinkActive="active">
                    <span class="me-1">📝</span> Préstamo
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link admin-link" routerLink="/admin/usuarios" routerLinkActive="active">
                    <span class="me-1">👥</span> Usuarios
                  </a>
                </li>
              }
            </ul>
          } @else {
            <div class="me-auto"></div>
          }

          <div class="d-flex align-items-lg-center mt-3 mt-lg-0 gap-3 user-zone">
            @if (authService.isAuthenticated()) {
              
              <div class="d-flex align-items-center text-light bg-primary-dark-mobile rounded p-2 p-lg-0">
                <span class="badge fw-bold me-2" 
                      [ngClass]="{
                        'bg-warning text-dark': authService.currentUser()?.role === 'Administrador',
                        'bg-info text-dark': authService.currentUser()?.role === 'Estudiante'
                      }">
                  {{ authService.currentUser()?.role | uppercase }}
                </span>
                <span class="fw-semibold">
                  {{ authService.currentUser()?.username }}
                </span>
              </div>
              
              <button class="btn btn-danger btn-sm d-flex align-items-center fw-semibold shadow-sm" 
                      (click)="logout()" title="Cerrar Sesión">
                <span class="fs-6 me-2">🚪</span> <span class="d-lg-none d-xl-inline">Salir</span>
              </button>

            } @else {
              <a routerLink="/login" class="btn btn-light fw-bold btn-sm shadow-sm w-100 w-lg-auto">
                🔐 Ingresar
              </a>
            }
          </div>

        </div> </div>
    </nav>
  `,
  styles: [`
    .navbar { z-index: 1030; min-height: 60px; }

    /* Enlaces base */
    .nav-link {
      color: rgba(255, 255, 255, 0.85) !important;
      padding: 0.5rem 1rem !important;
      border-radius: 50px;
      transition: all 0.2s ease;
      white-space: nowrap;
      
      &:hover {
        color: #fff !important;
        background-color: rgba(255, 255, 255, 0.15);
      }
      &.active {
        background-color: rgba(255, 255, 255, 0.95) !important;
        color: var(--bs-primary) !important;
        font-weight: 700;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
    }

    /* AJUSTES PARA MÓVIL (cuando el navbar se colapsa) */
    @media (max-width: 991.98px) {
      .navbar-collapse {
        background-color: var(--bs-primary); /* Mismo fondo que el navbar */
        padding: 1rem;
        border-radius: 0 0 1rem 1rem;
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        border-top: 1px solid rgba(255,255,255,0.1);
      }

      .nav-link {
        border-radius: 8px; /* Menos redondeado en móvil para que parezca lista */
        margin-bottom: 5px;
      }

      .user-zone {
         flex-direction: column;
         align-items: stretch !important; /* Botones ocupan todo el ancho */
      }

      /* Fondo un poco más oscuro para destacar al usuario en el menú móvil */
      .bg-primary-dark-mobile {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
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